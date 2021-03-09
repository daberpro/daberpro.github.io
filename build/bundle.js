
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let navbar = writable();
    let navbarShadow = writable(false);

    /* src\Navbar.svelte generated by Svelte v3.32.3 */
    const file = "src\\Navbar.svelte";

    // (156:0) {#if shwnvbr}
    function create_if_block(ctx) {
    	let div;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let button;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			li0 = element("li");
    			li0.textContent = "Home";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Contact";
    			t3 = space();
    			button = element("button");
    			button.textContent = "certificate";
    			attr_dev(li0, "class", "svelte-mgorp1");
    			add_location(li0, file, 157, 2, 2743);
    			attr_dev(li1, "class", "svelte-mgorp1");
    			add_location(li1, file, 158, 2, 2760);
    			attr_dev(button, "class", "svelte-mgorp1");
    			add_location(button, file, 159, 2, 2780);
    			attr_dev(div, "class", "menu svelte-mgorp1");
    			add_location(div, file, 156, 1, 2704);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, li0);
    			append_dev(div, t1);
    			append_dev(div, li1);
    			append_dev(div, t3);
    			append_dev(div, button);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(156:0) {#if shwnvbr}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div2;
    	let div0;
    	let b;
    	let t1;
    	let div1;
    	let li0;
    	let t3;
    	let li1;
    	let t5;
    	let button0;
    	let t7;
    	let button1;
    	let i;
    	let t8;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*shwnvbr*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			b = element("b");
    			b.textContent = "Daber";
    			t1 = space();
    			div1 = element("div");
    			li0 = element("li");
    			li0.textContent = "Home";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Contact";
    			t5 = space();
    			button0 = element("button");
    			button0.textContent = "certificate";
    			t7 = space();
    			button1 = element("button");
    			i = element("i");
    			t8 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(b, "class", "svelte-mgorp1");
    			add_location(b, file, 142, 2, 2452);
    			attr_dev(div0, "class", "navbar-start svelte-mgorp1");
    			add_location(div0, file, 141, 1, 2422);
    			attr_dev(li0, "class", "svelte-mgorp1");
    			add_location(li0, file, 147, 2, 2513);
    			attr_dev(li1, "class", "svelte-mgorp1");
    			add_location(li1, file, 148, 2, 2530);
    			attr_dev(button0, "class", "svelte-mgorp1");
    			add_location(button0, file, 149, 2, 2550);
    			attr_dev(i, "class", "fas fa-bars");
    			add_location(i, file, 151, 3, 2629);
    			attr_dev(button1, "id", "burger");
    			attr_dev(button1, "class", "svelte-mgorp1");
    			add_location(button1, file, 150, 2, 2582);
    			attr_dev(div1, "class", "navbar-end svelte-mgorp1");
    			add_location(div1, file, 146, 1, 2485);
    			attr_dev(div2, "class", "navbar svelte-mgorp1");
    			toggle_class(div2, "navbar-shadow2", /*shwnvbr*/ ctx[0]);
    			add_location(div2, file, 140, 0, 2348);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, b);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, li0);
    			append_dev(div1, t3);
    			append_dev(div1, li1);
    			append_dev(div1, t5);
    			append_dev(div1, button0);
    			append_dev(div1, t7);
    			append_dev(div1, button1);
    			append_dev(button1, i);
    			/*div2_binding*/ ctx[3](div2);
    			insert_dev(target, t8, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*shownavbar*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shwnvbr*/ 1) {
    				toggle_class(div2, "navbar-shadow2", /*shwnvbr*/ ctx[0]);
    			}

    			if (/*shwnvbr*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*shwnvbr*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*div2_binding*/ ctx[3](null);
    			if (detaching) detach_dev(t8);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $navbarShadow;
    	let $navbar;
    	validate_store(navbarShadow, "navbarShadow");
    	component_subscribe($$self, navbarShadow, $$value => $$invalidate(4, $navbarShadow = $$value));
    	validate_store(navbar, "navbar");
    	component_subscribe($$self, navbar, $$value => $$invalidate(1, $navbar = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, []);
    	let shwnvbr = false;

    	let shownavbar = () => {
    		$$invalidate(0, shwnvbr = !shwnvbr);
    		set_store_value(navbarShadow, $navbarShadow = !$navbarShadow, $navbarShadow);

    		if ($navbarShadow) {
    			set_store_value(navbar, $navbar.style.boxShadow = "", $navbar);
    		} else {
    			set_store_value(navbar, $navbar.style.boxShadow = `0px 10px 20px rgba(0,0,0,0.1)`, $navbar);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$navbar = $$value;
    			navbar.set($navbar);
    		});
    	}

    	$$self.$capture_state = () => ({
    		slide,
    		navbar,
    		navbarShadow,
    		shwnvbr,
    		shownavbar,
    		$navbarShadow,
    		$navbar
    	});

    	$$self.$inject_state = $$props => {
    		if ("shwnvbr" in $$props) $$invalidate(0, shwnvbr = $$props.shwnvbr);
    		if ("shownavbar" in $$props) $$invalidate(2, shownavbar = $$props.shownavbar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shwnvbr, $navbar, shownavbar, div2_binding];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\Intro.svelte generated by Svelte v3.32.3 */

    const file$1 = "src\\Intro.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let span;
    	let t2;
    	let br;
    	let t3;
    	let h2;
    	let t5;
    	let p;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Hello";
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			h2 = element("h2");
    			h2.textContent = "My Name Is Daber";
    			t5 = space();
    			p = element("p");
    			p.textContent = "this is my portofolio";
    			if (img.src !== (img_src_value = "/my icon.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "daber logo");
    			attr_dev(img, "class", "svelte-75hd2o");
    			add_location(img, file$1, 87, 2, 2775);
    			attr_dev(div0, "class", "image intro-image svelte-75hd2o");
    			add_location(div0, file$1, 86, 1, 2740);
    			attr_dev(span, "class", "svelte-75hd2o");
    			add_location(span, file$1, 91, 3, 2865);
    			add_location(br, file$1, 94, 3, 2900);
    			attr_dev(h2, "class", "svelte-75hd2o");
    			add_location(h2, file$1, 95, 3, 2910);
    			attr_dev(h1, "class", "svelte-75hd2o");
    			add_location(h1, file$1, 90, 2, 2856);
    			attr_dev(p, "class", "svelte-75hd2o");
    			add_location(p, file$1, 97, 2, 2948);
    			attr_dev(div1, "class", "intro-text svelte-75hd2o");
    			add_location(div1, file$1, 89, 1, 2828);
    			attr_dev(div2, "class", "info svelte-75hd2o");
    			add_location(div2, file$1, 85, 0, 2719);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(h1, span);
    			append_dev(h1, t2);
    			append_dev(h1, br);
    			append_dev(h1, t3);
    			append_dev(h1, h2);
    			append_dev(div1, t5);
    			append_dev(div1, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Intro", slots, []);

    	setTimeout(
    		() => {
    			let a = document.querySelector(".intro-image");
    			let b = document.querySelector(".intro-text");

    			a.style = ` opacity: 1;
					transform: scale(1.0);
					transition: all 0.5s ease-in-out;`;

    			b.style = ` opacity: 1;
					transform: scale(1.0);
					transition: all 0.6s ease-in-out;`;
    		},
    		1000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\Card.svelte generated by Svelte v3.32.3 */

    const file$2 = "src\\Card.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let b;
    	let t0_value = /*cardInfo*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*cardInfo*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let button;
    	let t4;
    	let t5_value = /*cardInfo*/ ctx[0].title + "";
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			button = element("button");
    			t4 = text("see ");
    			t5 = text(t5_value);
    			attr_dev(b, "class", "svelte-k7hkm6");
    			add_location(b, file$2, 96, 1, 1798);
    			attr_dev(p, "class", "svelte-k7hkm6");
    			add_location(p, file$2, 97, 1, 1824);
    			attr_dev(button, "class", "svelte-k7hkm6");
    			add_location(button, file$2, 98, 1, 1856);
    			attr_dev(div, "class", "card svelte-k7hkm6");
    			toggle_class(div, "hvr-bounce-to-right", /*cardInfo*/ ctx[0].bgToRight);
    			toggle_class(div, "hvr-bounce-to-bottom", /*cardInfo*/ ctx[0].bgToRight === void 0);
    			toggle_class(div, "hvr-bounce-to-left", !/*cardInfo*/ ctx[0].bgToRight);
    			add_location(div, file$2, 95, 0, 1624);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, b);
    			append_dev(b, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    			append_dev(div, button);
    			append_dev(button, t4);
    			append_dev(button, t5);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*goto*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cardInfo*/ 1 && t0_value !== (t0_value = /*cardInfo*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*cardInfo*/ 1 && t2_value !== (t2_value = /*cardInfo*/ ctx[0].description + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*cardInfo*/ 1 && t5_value !== (t5_value = /*cardInfo*/ ctx[0].title + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*cardInfo*/ 1) {
    				toggle_class(div, "hvr-bounce-to-right", /*cardInfo*/ ctx[0].bgToRight);
    			}

    			if (dirty & /*cardInfo*/ 1) {
    				toggle_class(div, "hvr-bounce-to-bottom", /*cardInfo*/ ctx[0].bgToRight === void 0);
    			}

    			if (dirty & /*cardInfo*/ 1) {
    				toggle_class(div, "hvr-bounce-to-left", !/*cardInfo*/ ctx[0].bgToRight);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, []);
    	let { cardInfo = {} } = $$props;

    	function goto() {
    		(cardInfo?.location)
    		? location.href = cardInfo?.location
    		: 0;
    	}

    	const writable_props = ["cardInfo"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("cardInfo" in $$props) $$invalidate(0, cardInfo = $$props.cardInfo);
    	};

    	$$self.$capture_state = () => ({ cardInfo, goto });

    	$$self.$inject_state = $$props => {
    		if ("cardInfo" in $$props) $$invalidate(0, cardInfo = $$props.cardInfo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cardInfo, goto];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { cardInfo: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get cardInfo() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cardInfo(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\CardList.svelte generated by Svelte v3.32.3 */
    const file$3 = "src\\CardList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (33:1) {#each card_project as card_list}
    function create_each_block(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: { cardInfo: /*card_list*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(33:1) {#each card_project as card_list}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let current;
    	let each_value = /*card_project*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "my project";
    			t1 = space();
    			p = element("p");
    			p.textContent = "this is my project ever i made";
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "text-animate svelte-19l5x45");
    			add_location(h1, file$3, 30, 1, 493);
    			attr_dev(p, "class", "text-animate svelte-19l5x45");
    			add_location(p, file$3, 31, 1, 536);
    			attr_dev(div, "class", "card-list svelte-19l5x45");
    			add_location(div, file$3, 29, 0, 467);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(div, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*card_project*/ 1) {
    				each_value = /*card_project*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardList", slots, []);

    	let card_project = [
    		{
    			title: "seleku",
    			description: "seleku is a framework inspired by svelte",
    			bgToRight: true,
    			location: "https://github.com/daberpro/seleku"
    		},
    		{
    			title: "joss",
    			description: "joss is a framework inspired by tailwind"
    		},
    		{
    			title: "daber engine",
    			description: "daber engine is a engine for make a game using javascript",
    			bgToRight: false
    		},
    		{
    			title: "seleku native",
    			description: "seleku native is a framework use like a compiler supported by node js",
    			bgToRight: true
    		},
    		{
    			title: "jscp native",
    			description: "jscp is a software system write in c++ and use the xml to make a cross platform mobile apps"
    		},
    		{
    			title: "daber preproject",
    			description: "daber preproject is an app to help manage the code",
    			bgToRight: false
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CardList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ card_project, Card });

    	$$self.$inject_state = $$props => {
    		if ("card_project" in $$props) $$invalidate(0, card_project = $$props.card_project);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [card_project];
    }

    class CardList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardList",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\ListWork.svelte generated by Svelte v3.32.3 */
    const file$4 = "src\\ListWork.svelte";

    function create_fragment$4(ctx) {
    	let div8;
    	let b;
    	let t1;
    	let div1;
    	let div0;
    	let i0;
    	let t2;
    	let p0;
    	let t4;
    	let div3;
    	let div2;
    	let i1;
    	let t5;
    	let p1;
    	let t7;
    	let div5;
    	let div4;
    	let i2;
    	let t8;
    	let p2;
    	let t10;
    	let div7;
    	let div6;
    	let i3;
    	let t11;
    	let p3;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			b = element("b");
    			b.textContent = "I am working with";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "HTML";
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			i1 = element("i");
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "CSS";
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			i2 = element("i");
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "JAVASCRIPT";
    			t10 = space();
    			div7 = element("div");
    			div6 = element("div");
    			i3 = element("i");
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "NODE JS";
    			attr_dev(b, "class", "text-animate svelte-1wlg3sb");
    			add_location(b, file$4, 64, 1, 1799);
    			attr_dev(i0, "class", "fab fa-html5 svelte-1wlg3sb");
    			add_location(i0, file$4, 67, 3, 1897);
    			attr_dev(div0, "class", "img svelte-1wlg3sb");
    			add_location(div0, file$4, 66, 2, 1875);
    			attr_dev(p0, "class", "svelte-1wlg3sb");
    			add_location(p0, file$4, 69, 2, 1940);
    			attr_dev(div1, "class", "info-list  svelte-1wlg3sb");
    			add_location(div1, file$4, 65, 1, 1847);
    			attr_dev(i1, "class", "fab fa-css3-alt svelte-1wlg3sb");
    			add_location(i1, file$4, 73, 3, 2013);
    			attr_dev(div2, "class", "img svelte-1wlg3sb");
    			add_location(div2, file$4, 72, 2, 1991);
    			attr_dev(p1, "class", "svelte-1wlg3sb");
    			add_location(p1, file$4, 75, 2, 2058);
    			attr_dev(div3, "class", "info-list  svelte-1wlg3sb");
    			add_location(div3, file$4, 71, 1, 1963);
    			attr_dev(i2, "class", "fab fa-js-square svelte-1wlg3sb");
    			add_location(i2, file$4, 79, 3, 2130);
    			attr_dev(div4, "class", "img svelte-1wlg3sb");
    			add_location(div4, file$4, 78, 2, 2108);
    			attr_dev(p2, "class", "svelte-1wlg3sb");
    			add_location(p2, file$4, 81, 2, 2176);
    			attr_dev(div5, "class", "info-list  svelte-1wlg3sb");
    			add_location(div5, file$4, 77, 1, 2080);
    			attr_dev(i3, "class", "fab fa-node-js svelte-1wlg3sb");
    			add_location(i3, file$4, 85, 3, 2255);
    			attr_dev(div6, "class", "img svelte-1wlg3sb");
    			add_location(div6, file$4, 84, 2, 2233);
    			attr_dev(p3, "class", "svelte-1wlg3sb");
    			add_location(p3, file$4, 87, 2, 2299);
    			attr_dev(div7, "class", "info-list  svelte-1wlg3sb");
    			add_location(div7, file$4, 83, 1, 2205);
    			attr_dev(div8, "class", "list svelte-1wlg3sb");
    			add_location(div8, file$4, 63, 0, 1748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, b);
    			append_dev(div8, t1);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, i1);
    			append_dev(div3, t5);
    			append_dev(div3, p1);
    			append_dev(div8, t7);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div4, i2);
    			append_dev(div5, t8);
    			append_dev(div5, p2);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, i3);
    			append_dev(div7, t11);
    			append_dev(div7, p3);
    			/*div8_binding*/ ctx[1](div8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			/*div8_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $navbarShadow;
    	let $navbar;
    	validate_store(navbarShadow, "navbarShadow");
    	component_subscribe($$self, navbarShadow, $$value => $$invalidate(2, $navbarShadow = $$value));
    	validate_store(navbar, "navbar");
    	component_subscribe($$self, navbar, $$value => $$invalidate(3, $navbar = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ListWork", slots, []);
    	let this_self_element;

    	window.onscroll = args => {
    		if ($navbarShadow && args.path[1].window.scrollY >= 50) {
    			set_store_value(navbar, $navbar.style.boxShadow = ``, $navbar);
    			set_store_value(navbar, $navbar.style.backgroundColor = `white`, $navbar);
    		} else if (args.path[1].window.scrollY >= 50) {
    			set_store_value(navbar, $navbar.style.boxShadow = `0px 10px 20px rgba(0,0,0,0.1)`, $navbar);
    			set_store_value(navbar, $navbar.style.backgroundColor = `white`, $navbar);
    		} else {
    			set_store_value(navbar, $navbar.style.boxShadow = ``, $navbar);
    			set_store_value(navbar, $navbar.style.backgroundColor = ``, $navbar);
    		}

    		let position = this_self_element?.getBoundingClientRect?.()?.top;
    		let child = document.querySelectorAll(".info-list");
    		let childText = document.querySelectorAll(".text-animate");
    		let childCard = document.querySelectorAll(".card");

    		childText?.forEach(i => {
    			if (i?.getBoundingClientRect?.()?.top < innerHeight) i.style = ` opacity: 1.0;
							transform: scale(1.0);
							transition: all 0.5s ease-in-out;`; else i.style = ` opacity: 0.1;
							transform: scale(0.1);
							transition: all 0.5s ease-in-out;`;
    		});

    		childCard?.forEach(i => {
    			if (i?.getBoundingClientRect?.()?.top < innerHeight - 20) i.style = ` opacity: 1.0;
							transform: scale(1.0);
							transition: all 0.5s ease-in-out;`; else i.style = ` opacity: 0.1;
							transform: scale(0.1);
							transition: all 0.5s ease-in-out;`;
    		});

    		position < innerHeight - innerHeight / 4
    		? (() => {
    				child?.forEach(i => {
    					i.style = ` opacity: 1.0;
							transform: scale(1.0);
							transition: all 1.2s ease-in-out;`;
    				});
    			})()
    		: (() => {
    				child?.forEach(i => {
    					i.style = ` opacity: 0.1;
							transform: scale(0.1);
							transition: all 1.2s ease-in-out;`;
    				});
    			})();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ListWork> was created with unknown prop '${key}'`);
    	});

    	function div8_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			this_self_element = $$value;
    			$$invalidate(0, this_self_element);
    		});
    	}

    	$$self.$capture_state = () => ({
    		navbar,
    		navbarShadow,
    		this_self_element,
    		$navbarShadow,
    		$navbar
    	});

    	$$self.$inject_state = $$props => {
    		if ("this_self_element" in $$props) $$invalidate(0, this_self_element = $$props.this_self_element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [this_self_element, div8_binding];
    }

    class ListWork extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListWork",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.32.3 */
    const file$5 = "src\\App.svelte";

    function create_fragment$5(ctx) {
    	let style;
    	let t1;
    	let navbar;
    	let t2;
    	let intro;
    	let t3;
    	let listwork;
    	let t4;
    	let cardlist;
    	let t5;
    	let footer;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	intro = new Intro({ $$inline: true });
    	listwork = new ListWork({ $$inline: true });
    	cardlist = new CardList({ $$inline: true });

    	const block = {
    		c: function create() {
    			style = element("style");
    			style.textContent = "html,body{\n\t\t\tmargin:0px;\n\t\t\tpadding:0px;\n\t\t\tbackground: rgba(230,230,250,0.2);\n\t\t\tscroll-behavior: smooth;\n\t\t}\n\t\t/* width */\n\t\t::-webkit-scrollbar {\n\t\t  width: 5px;\n\t\t}\n\n\t\t/* Track */\n\t\t::-webkit-scrollbar-track {\n\t\t  background: transparent;\n\t\t}\n\n\t\t/* Handle */\n\t\t::-webkit-scrollbar-thumb {\n\t\t  background: transparent;\n\t\t  border-radius: 5px;\n\t\t}\n\n\t\t/* Handle on hover */\n\t\t::-webkit-scrollbar-thumb:hover {\n\t\t  background: #5ddef4;\n\t\t}";
    			t1 = space();
    			create_component(navbar.$$.fragment);
    			t2 = space();
    			create_component(intro.$$.fragment);
    			t3 = space();
    			create_component(listwork.$$.fragment);
    			t4 = space();
    			create_component(cardlist.$$.fragment);
    			t5 = space();
    			footer = element("footer");
    			footer.textContent = "© Daber";
    			add_location(style, file$5, 12, 1, 204);
    			attr_dev(footer, "class", "my-footer svelte-1y8c9h");
    			add_location(footer, file$5, 49, 0, 762);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, style);
    			insert_dev(target, t1, anchor);
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(intro, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(listwork, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(cardlist, target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, footer, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(intro.$$.fragment, local);
    			transition_in(listwork.$$.fragment, local);
    			transition_in(cardlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(intro.$$.fragment, local);
    			transition_out(listwork.$$.fragment, local);
    			transition_out(cardlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(style);
    			if (detaching) detach_dev(t1);
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(intro, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(listwork, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(cardlist, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar, Intro, CardList, ListWork });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
