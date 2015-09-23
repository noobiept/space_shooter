declare module Game {
    module Utilities {
        function shuffle(array: any[]): any[];
        var KEY_CODE: {
            "0": number;
            "1": number;
            "2": number;
            "3": number;
            "4": number;
            "5": number;
            "6": number;
            "7": number;
            "8": number;
            "9": number;
            backspace: number;
            tab: number;
            enter: number;
            esc: number;
            space: number;
            end: number;
            home: number;
            leftArrow: number;
            upArrow: number;
            rightArrow: number;
            downArrow: number;
            del: number;
            a: number;
            b: number;
            c: number;
            d: number;
            e: number;
            f: number;
            g: number;
            h: number;
            i: number;
            j: number;
            k: number;
            l: number;
            m: number;
            n: number;
            o: number;
            p: number;
            q: number;
            r: number;
            s: number;
            t: number;
            u: number;
            v: number;
            w: number;
            x: number;
            y: number;
            z: number;
            f1: number;
            f2: number;
            f3: number;
            f4: number;
            f5: number;
            f6: number;
            f7: number;
            f8: number;
            f9: number;
            f10: number;
            f11: number;
            f12: number;
        };
        var MOUSE_CODE: {
            left: number;
            middle: number;
            right: number;
        };
        function getObject(key: string): any;
        function saveObject(key: string, value: any): void;
        function isArray(element: any): boolean;
        function isBoolean(element: any): boolean;
        function isFunction(element: any): boolean;
        function isInteger(value: any): boolean;
        function isNumber(element: any): boolean;
        function isString(element: any): boolean;
        function getRandomFloat(min: number, max: number): number;
        function getRandomInt(min: number, max: number): number;
        function getSeveralRandomInts(min: number, max: number, howMany: number): number[];
        function numberOfDigits(theNumber: number): number;
        function round(num: number, dec: number): number;
        function deepClone(obj: any): any;
        function createEnum(values: string[], start?: number): {};
        function inheritPrototype(derivedClass: Function, baseClass: Function): void;
        function timeToString(dateMilliseconds: number, totalUnits?: number): string;
        class Timeout {
            is_active: boolean;
            id: number;
            constructor();
            start(functionToCall: Function, interval: number): void;
            clear(): void;
        }
        class Timer {
            is_active: boolean;
            start_value: number;
            end_value: number;
            end_callback: () => any;
            tick_callback: () => any;
            count_down: boolean;
            time_count: number;
            interval_f: number;
            html_element: HTMLElement;
            constructor(htmlElement: HTMLElement);
            start(args?: {
                startValue?: number;
                endValue?: number;
                endCallback?: () => any;
                tickCallback?: () => any;
                countDown?: boolean;
            }): void;
            resume(): void;
            stop(): void;
            reset(): void;
            restart(): void;
            add(time: number): void;
            getTimeString(): string;
            getTimeSeconds(): number;
            getTimeMilliseconds(): number;
        }
        function calculateAngle(aX: number, aY: number, bX: number, bY: number): number;
        function calculateDistance(aX: number, aY: number, bX: number, bY: number): number;
        function toDegrees(radians: number): number;
        function toRadians(degrees: number): number;
    }
}
declare module Game {
    interface EventDispatcherArgs {
    }
    class EventDispatcher {
        protected _listeners: any;
        constructor(args?: EventDispatcherArgs);
        addEventListener(type: string, listener: (data: any) => any): boolean;
        removeEventListener(type: string, listener?: (data: any) => any): boolean;
        removeAllEventListeners(): void;
        dispatchEvent(type: string, data?: any): void;
        hasListeners(type: string): boolean;
    }
}
declare module Game {
    interface ElementArgs extends EventDispatcherArgs {
        x?: number;
        y?: number;
    }
    class Element extends EventDispatcher {
        x: number;
        y: number;
        vertices: CollisionDetection.Vertices;
        opacity: number;
        visible: boolean;
        scaleX: number;
        scaleY: number;
        column: number;
        line: number;
        _width: number;
        _height: number;
        _half_width: number;
        _half_height: number;
        _rotation: number;
        _container: Container;
        _has_logic: boolean;
        protected _removed: boolean;
        constructor(args?: ElementArgs);
        drawElement(ctx: CanvasRenderingContext2D): void;
        draw(ctx: CanvasRenderingContext2D): void;
        logic(deltaTime: number): void;
        intersect(refX: number, refY: number): any[];
        mouseClickEvents(x: any, y: any, event: any): boolean;
        dispatchMouseOverEvent(): void;
        dispatchMouseOutEvent(): void;
        dispatchMouseMoveEvent(): void;
        dispatchMouseClickEvent(event: MouseEvent): void;
        getWidth(): number;
        getHeight(): number;
        setWidth(width: number): void;
        setHeight(height: number): void;
        setDimensions(width: number, height: number): void;
        rotation: number;
        rotate(angle: number, degrees?: boolean): void;
        remove(): void;
        isRemoved(): boolean;
        clone(): Element;
        updateVertices(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
        getVertices(): {
            x: number;
            y: number;
        }[][];
    }
}
declare module Game {
    interface BitmapArgs extends ElementArgs {
        image: HTMLImageElement;
    }
    class Bitmap extends Element {
        protected _image: HTMLImageElement;
        protected _source_x: number;
        protected _source_y: number;
        constructor(args: BitmapArgs);
        drawElement(ctx: any): void;
        clone(): Bitmap;
        image: HTMLImageElement;
    }
}
declare module Game {
    interface ContainerArgs extends ElementArgs {
        children?: Element | Element[];
    }
    class Container extends Element {
        protected _children: Element[];
        constructor(args?: ContainerArgs);
        addChild(elements: any): void;
        removeChild(args: any): void;
        removeAllChildren(): void;
        remove(): void;
        draw(ctx: CanvasRenderingContext2D): void;
        drawElement(ctx: CanvasRenderingContext2D): void;
        intersect(x: number, y: number): any[];
        mouseClickEvents(x: any, y: any, event: any): boolean;
        calculateDimensions(): void;
        logic(deltaTime: number): void;
        updateVertices(x: any, y: any, scaleX: any, scaleY: any, rotation: any): void;
        getVertices(): any[];
        clone(): Container;
    }
}
declare module Game {
    interface BulletArgs extends ContainerArgs {
        angleOrTarget?: number | Element;
        movementSpeed?: number;
    }
    class Bullet extends Container {
        movement_speed: number;
        protected _move_x: number;
        protected _move_y: number;
        protected _target: Element;
        constructor(args?: BulletArgs);
        setAngle(angle: number): void;
        setTarget(target: Element): void;
        fixedLogic(deltaTime: number): void;
        targetLogic(deltaTime: number): void;
        logic(deltaTime: number): void;
        remove(): void;
        clone(): Bullet;
    }
}
declare module Game {
    interface CanvasArgs {
        width: number;
        height: number;
    }
    class Canvas {
        _canvas: HTMLCanvasElement;
        protected _ctx: CanvasRenderingContext2D;
        protected _width: number;
        protected _height: number;
        protected _children: Element[];
        events_enabled: boolean;
        update_on_loop: boolean;
        constructor(args: CanvasArgs);
        addChild(args: any): void;
        removeChild(args: any): boolean;
        getChildrenIn(x: number, y: number): any[];
        updateVertices(): void;
        logic(deltaTime: number): void;
        draw(): void;
        mouseClickEvents(event: MouseEvent): void;
        updateDimensions(width: number, height: number): void;
        getRandomPosition(): {
            x: number;
            y: number;
        };
        isInCanvas(x: number, y: number): boolean;
        getWidth(): number;
        getHeight(): number;
        getHtmlCanvasElement(): HTMLCanvasElement;
        getCanvasContext(): CanvasRenderingContext2D;
        getAllChildren(): Element[];
    }
}
declare module Game {
    interface CircleArgs extends ElementArgs {
        radius: number;
        color: string;
    }
    class Circle extends Element {
        color: string;
        protected _radius: number;
        constructor(args: CircleArgs);
        radius: number;
        drawElement(ctx: CanvasRenderingContext2D): void;
        clone(): Circle;
    }
}
declare module Game {
    module CollisionDetection {
        type Vertices = {
            x: number;
            y: number;
        }[];
        function polygonPolygon(one: Vertices, two: Vertices): boolean;
        function polygonPolygonList(list1: Vertices[], list2: Vertices[]): boolean;
        function polygonPoint(vertices: Vertices, point: any): boolean;
        function boxBox(oneX: number, oneY: number, oneWidth: number, oneHeight: number, twoX: number, twoY: number, twoWidth: number, twoHeight: number): boolean;
        function circleCircle(x1: number, y1: number, radius1: number, x2: number, y2: number, radius2: number): boolean;
        function circlePoint(circleX: number, circleY: number, circleRadius: number, pointX: number, pointY: number): boolean;
        function pointBox(pointX: number, pointY: number, boxX: number, boxY: number, boxWidth: number, boxHeight: number): boolean;
    }
}
declare module Game {
    interface GridArgs {
        columns: number;
        lines: number;
    }
    class Grid {
        protected _grid: any[][];
        columns: number;
        lines: number;
        constructor(args: GridArgs);
        add(value: any, column: number, line: number): any;
        move(sourceColumn: number, sourceLine: number, destinationColumn: number, destinationLine: number): any;
        remove(column: number, line: number): any;
        get(column: number, line: number): any;
        isEmpty(column: number, line: number): boolean;
        normalizePosition(column: number, line: number): {
            column: number;
            line: number;
        };
        isInGrid(column: number, line: number): boolean;
        getRandomPosition(): {
            column: number;
            line: number;
        };
        getRandomEmptyPosition(): any;
        getEmptyPositions(): any[];
        getNeighbors(refColumn: number, refLine: number, range?: number): any[];
    }
}
declare module Game {
    interface ElementGridArgs extends EventDispatcherArgs, GridArgs {
        squareSize: number;
        refX?: number;
        refY?: number;
        background?: {
            color: string;
            fill: boolean;
            canvasId?: number;
        };
    }
    class ElementGrid extends Grid {
        square_size: number;
        ref_x: number;
        ref_y: number;
        protected _background: Rectangle;
        events: EventDispatcher;
        constructor(args: ElementGridArgs);
        toCanvas(column: number, line: number): {
            x: number;
            y: number;
        };
        toGrid(x: number, y: number): {
            column: number;
            line: number;
        };
        add(element: Element, column: number, line: number): any;
        move(sourceColumn: number, sourceLine: number, destColumn: number, destLine: number, duration?: number): any;
        remove(column: number, line: number): any;
        getDimensions(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        clear(): void;
    }
}
declare module Game {
    function init(htmlContainer: HTMLElement, canvasWidth: number, canvasHeight: number): void;
    function startGameLoop(): void;
    function stopGameLoop(): void;
    function activateMouseMoveEvents(interval: number): void;
    function disableMouseMoveEvents(): void;
    function getCanvas(id?: number): Canvas;
    function addCanvas(canvas: Game.Canvas, position?: number): number;
    function addElement(element: Element | Element[], id?: number): void;
    function removeElement(element: Element | Element[]): boolean;
    function addToGameLoop(callback: () => any, delay: number, isInterval?: boolean): boolean;
    function removeFromGameLoop(callback: () => any): boolean;
    function removeAllCallbacks(): void;
    function getCanvasContainer(): HTMLDivElement;
    function getMousePosition(): {
        x: number;
        y: number;
    };
}
declare module Game {
    module HighScore {
        function init(maxScoresSaved: number, storageName: string, ascending: boolean): void;
        function add(key: string, value: number): void;
        function get(key: string): any;
        function clear(): void;
    }
}
declare module Game {
    module Html {
        interface HtmlElementArgs {
            cssId?: string;
            cssClass?: string | string[];
            preText?: string;
        }
        class HtmlElement {
            container: HTMLElement;
            protected _is_active: boolean;
            protected _pre_text: HTMLElement;
            constructor(args?: HtmlElementArgs);
            setActive(yesNo: boolean): void;
            isActive(): boolean;
            addEvents(): void;
            removeEvents(): void;
            clear(): void;
        }
        interface HtmlContainerArgs extends HtmlElementArgs {
            children?: HtmlElement | HtmlElement[];
        }
        class HtmlContainer extends HtmlElement {
            protected _children: HtmlElement[];
            constructor(args?: HtmlContainerArgs);
            addChild(args: any): void;
            removeChild(args: any): void;
            removeAllChildren(): void;
            clear(): void;
        }
        interface ValueArgs extends HtmlElementArgs {
            value: any;
        }
        class Value extends HtmlElement {
            protected value: any;
            element: HTMLElement;
            constructor(args: ValueArgs);
            setValue(value: any): void;
            getValue(): any;
            clear(): void;
        }
        interface ButtonArgs extends ValueArgs {
            callback?: (button: Button) => any;
        }
        class Button extends Value {
            protected click_ref: (event: MouseEvent) => any;
            constructor(args: ButtonArgs);
            addEvents(): void;
            removeEvents(): void;
            clear(): void;
        }
        interface BooleanArgs extends ButtonArgs {
            value: boolean;
        }
        class Boolean extends Button {
            protected value: boolean;
            constructor(args: BooleanArgs);
            setValue(value: boolean): void;
            getValue(): boolean;
        }
        interface TwoStateArgs extends ButtonArgs {
            value2: string;
            callback2?: (button: TwoState) => any;
        }
        class TwoState extends Button {
            protected isValue1: boolean;
            constructor(args: TwoStateArgs);
            getValue(): string;
        }
        interface MultipleOptionsArgs extends HtmlElementArgs {
            options: string[];
            callback?: (button: MultipleOptions, position: number, htmlElement: HTMLElement) => any;
        }
        class MultipleOptions extends HtmlElement {
            protected elements: HTMLElement[];
            protected click_ref: () => any;
            protected selected: HTMLElement;
            constructor(args: MultipleOptionsArgs);
            select(position: number): void;
            getValue(): string;
            addEvents(): void;
            removeEvents(): void;
            clear(): void;
        }
        interface RangeArgs extends HtmlElementArgs {
            min: number;
            max: number;
            value: number;
            step?: number;
            onChange?: (button: Range) => any;
        }
        class Range extends HtmlElement {
            protected value: HTMLElement;
            protected input: HTMLInputElement;
            protected current_value: number;
            protected change_ref: (event) => any;
            protected input_ref: (event) => any;
            number_of_decimals: number;
            constructor(args: RangeArgs);
            setValue(value: number): void;
            getValue(): number;
            addEvents(): void;
            removeEvents(): void;
            clear(): void;
        }
        interface TextArgs extends HtmlElementArgs {
            placeholder?: string;
            callback?: (button: Text) => any;
            buttonText?: string;
        }
        class Text extends HtmlElement {
            protected input: HTMLInputElement;
            protected button: Button;
            protected key_ref: (event) => any;
            constructor(args?: TextArgs);
            setValue(value: string): void;
            getValue(): string;
            addEvents(): void;
            removeEvents(): void;
            clear(): void;
        }
    }
}
declare module Game {
    interface MessageArgs extends Game.Html.HtmlContainerArgs {
        body: any;
        container: HTMLElement;
        buttons?: HTMLElement | HTMLElement[];
        timeout?: number;
        background?: boolean;
    }
    class Message extends Game.Html.HtmlContainer {
        protected body: Html.HtmlContainer;
        protected buttons: Html.HtmlContainer;
        protected background: HTMLElement;
        protected timeout: Utilities.Timeout;
        constructor(args: MessageArgs);
        clear(): void;
        setBody(body: any): void;
    }
}
declare module Game {
    module PathFinding {
        function breadthFirstSearch(map: number[][], destination: {
            column: number;
            line: number;
        }, positionType: {
            passable: number;
            blocked: number;
        }): any[];
    }
}
declare module Game {
    module Sound {
        function init(): void;
        function decodeAudio(data: ArrayBuffer, callback: (decodedData: AudioBuffer) => any): void;
        function play(audioBuffer: AudioBuffer): void;
    }
}
interface Window {
    URL: any;
}
declare module Game {
    interface PreloadArgs extends EventDispatcherArgs {
        saveGlobal?: boolean;
    }
    class Preload extends EventDispatcher {
        save_global: boolean;
        protected _data: Object;
        protected _total_items: number;
        protected _loaded_items: number;
        protected _failed_ids: string[];
        protected _loaded_ids: string[];
        constructor(args?: PreloadArgs);
        protected _loaded(id: string, data: any): void;
        protected _failed_to_load(id: string): void;
        protected _loading_complete(): void;
        protected _on_error(event: any, id: string): void;
        protected _on_abort(event: any, id: string): void;
        protected _on_progress(event: ProgressEvent): void;
        load(id: string, path: string, typeId?: Game.Preload.TYPES): void;
        loadManifest(manifest: {
            id: string;
            path: string;
        }[], basePath?: string): void;
        get(id: string): any;
    }
    module Preload {
        enum TYPES {
            image = 0,
            json = 1,
            text = 2,
            audio = 3,
        }
        var EXTENSIONS: {
            image: string[];
            json: string[];
            text: string[];
            audio: string[];
        };
        var RESPONSE_TYPE: {
            image: string;
            json: string;
            text: string;
            audio: string;
        };
        var DATA: {};
        function get(id: string): any;
        function getType(file: string): any;
    }
}
declare module Game {
    interface RectangleArgs extends ElementArgs {
        width: number;
        height: number;
        color: string;
        fill?: boolean;
    }
    class Rectangle extends Element {
        color: string;
        fill: boolean;
        constructor(args: RectangleArgs);
        drawElement(ctx: CanvasRenderingContext2D): void;
        clone(): Rectangle;
    }
}
declare module Game {
    interface ScrollingBitmapArgs extends BitmapArgs {
        direction: ScrollingBitmapArgs.Direction;
        step: number;
        interval?: number;
    }
    module ScrollingBitmapArgs {
        enum Direction {
            left = 0,
            right = 1,
            top = 2,
            bottom = 3,
        }
    }
    class ScrollingBitmap extends Bitmap {
        protected _count: number;
        protected _interval: number;
        protected _step: number;
        protected _ref_position: number;
        protected _direction: ScrollingBitmapArgs.Direction;
        protected _scroll: () => void;
        constructor(args: ScrollingBitmapArgs);
        setDirection(direction: ScrollingBitmapArgs.Direction): void;
        setStep(step: number): void;
        setInterval(interval: number): void;
        clearInterval(): void;
        scroll_left(): void;
        scroll_right(): void;
        scroll_top(): void;
        scroll_bottom(): void;
        protected _draw_horizontal(ctx: CanvasRenderingContext2D): void;
        protected _draw_vertical(ctx: CanvasRenderingContext2D): void;
        logic(deltaTime: number): void;
        clone(): ScrollingBitmap;
    }
}
declare module Game {
    interface SpriteArgs extends BitmapArgs {
        frameWidth: number;
        frameHeight: number;
        animations?: {
            [id: string]: number[];
        };
        interval?: number;
    }
    class Sprite extends Bitmap {
        interval: number;
        protected _count_interval: number;
        protected _frames_per_line: number;
        protected _animations: {
            [id: string]: number[];
        };
        protected _current_animation: number[];
        protected _current_animation_position: number;
        constructor(args: SpriteArgs);
        setFrame(frame: number): void;
        play(animationId: string, reset?: boolean): boolean;
        stop(): void;
        nextFrame(): void;
        logic(deltaTime: number): void;
        clone(): Sprite;
    }
}
declare module Game {
    interface TextArgs extends ElementArgs {
        text?: string;
        fontFamily?: string;
        fontSize?: number;
        timeout?: number;
        textAlign?: string;
        textBaseline?: string;
        fill?: boolean;
        color?: string;
    }
    class Text extends Element {
        textAlign: string;
        textBaseline: string;
        fill: boolean;
        color: string;
        protected _text: string;
        protected _font_family: string;
        protected _font_size: number;
        protected _font: string;
        protected _timeout: number;
        protected _lines: string[];
        constructor(args: TextArgs);
        drawElement(ctx: CanvasRenderingContext2D): void;
        text: string;
        font_family: string;
        font_size: number;
        clone(): Text;
    }
}
declare module Game {
    enum TweenAction {
        properties = 0,
        wait = 1,
        call = 2,
    }
    interface TweenStep {
        action: TweenAction;
        duration?: number;
        end_properties?: Object;
        ease?: (value: number) => number;
        callback?: () => any;
    }
    class Tween {
        static _tweens: Tween[];
        protected _element: Object;
        protected _steps: TweenStep[];
        protected _current_step: TweenStep;
        protected _start_properties: Object;
        protected _count: number;
        protected _update: (delta: number) => any;
        constructor(element: Object);
        start(): void;
        to(properties: Object, duration: number, ease?: (value: number) => number): Tween;
        wait(duration: number): Tween;
        call(callback: () => any): Tween;
        remove(): void;
        nextStep(): void;
        protected waitUpdate(deltaTime: number): void;
        protected propertiesUpdate(deltaTime: any): void;
        static getTween(element: Object): Tween;
        static removeTweens(element: Object): void;
        static removeAll(): void;
        static update(deltaTime: number): void;
    }
    module Tween {
        module Ease {
            function linear(value: number): number;
            function quadraticIn(value: number): number;
        }
    }
}
declare module Game {
    interface UnitArgs extends ContainerArgs {
        movementSpeed?: number;
        health?: number;
    }
    enum UnitMovement {
        stop = 0,
        angle = 1,
        destination = 2,
        loop = 3,
        follow = 4,
    }
    class Unit extends Container {
        static _all: Unit[];
        static collidesWith: Unit[];
        movement_speed: number;
        health: number;
        protected _movement_type: UnitMovement;
        protected _is_moving: boolean;
        protected _move_x: number;
        protected _move_y: number;
        protected _move_callback: () => any;
        protected _destination_x: number;
        protected _destination_y: number;
        protected _is_destination_x_diff_positive: boolean;
        protected _is_destination_y_diff_positive: boolean;
        protected _path: {
            x: number;
            y: number;
            callback?: () => any;
        }[];
        protected _loop_path_position: number;
        protected _follow_target: Element;
        protected _weapons: Weapon[];
        constructor(args?: UnitArgs);
        addWeapon(weapon: Weapon): number;
        removeWeapon(weaponId: number): Weapon;
        getWeapon(weaponId: number): Weapon;
        getAllWeapons(): Weapon[];
        remove(animationDuration?: number): void;
        protected _removeNow(): void;
        moveTo(x: number, y: number, callback?: () => any): void;
        moveToNext(): boolean;
        stop(): void;
        queueMoveTo(x: number, y: number, callback?: () => any): void;
        moveLoop(path: {
            x: number;
            y: number;
            callback?: () => any;
        }[]): void;
        moveAngle(angle: number, degrees?: boolean, callback?: () => any): void;
        follow(element: Element): void;
        protected movementLogic(delta: number): void;
        protected movementFollowLogic(delta: number): void;
        protected movementAngleLogic(delta: number): void;
        protected movementPathLogic(delta: number): void;
        protected collisionLogic(delta: number): void;
        logic(delta: number): void;
        clone(): Unit;
    }
}
declare module Game {
    module Vector {
        interface Vector {
            x: number;
            y: number;
        }
        function add(one: Vector, two: Vector): {
            x: number;
            y: number;
        };
        function subtract(one: Vector, two: Vector): {
            x: number;
            y: number;
        };
        function magnitude(vector: Vector): number;
        function multiply(vector: Vector, scalar: number): {
            x: number;
            y: number;
        };
        function dotProduct(one: Vector, two: Vector): number;
        function rotate(center: Vector, vector: Vector, angle: number): {
            x: number;
            y: number;
        };
        function normalLeft(vector: Vector): {
            x: number;
            y: number;
        };
        function normalRight(vector: Vector): {
            x: number;
            y: number;
        };
        function normalize(vector: Vector): {
            x: number;
            y: number;
        };
        function projection(one: Vector, two: Vector): {
            x: number;
            y: number;
        };
    }
}
declare module Game {
    interface WeaponArgs {
        bulletContainer: Container | Canvas;
        fireInterval?: number;
        damage?: number;
    }
    class Weapon {
        element: Element;
        damage: number;
        fire_interval: number;
        protected _is_ready: boolean;
        protected _fire_count: number;
        protected _bullet_types: Bullet[];
        protected _bullet_intervals: {
            count: number;
            bulletId: number;
            interval: number;
            angleOrTarget: number | Element;
        }[];
        protected _bullets: Bullet[];
        protected _bullet_container: Container | Canvas;
        constructor(args: WeaponArgs);
        addBulletType(bullet: Bullet): number;
        stopFiring(): void;
        firingPattern(angleOrTarget: number | Element, bulletId: number): boolean;
        fire(angleOrTarget?: number | Element, bulletId?: number): boolean;
        forceFire(angleOrTarget?: number | Element, bulletId?: number, interval?: number): boolean;
        protected _fire(angleOrTarget: number | Element, bulletId: number): boolean;
        logic(deltaTime: number): void;
        checkCollision(element: Element, vertices: CollisionDetection.Vertices[]): boolean;
        isReady(): boolean;
        clone(): Weapon;
    }
}
