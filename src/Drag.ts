import * as EventEmitter from 'eventemitter3';
interface callbackFunc {
    (offsetX: number, offsetY: number): void;
}

export default class Drag extends EventEmitter{
    private ele: Element
    private isSupportTouch: boolean
    private originX: number 
    private originY: number
    private mouseDown: boolean

    constructor(ele: Element){
        super()
        this.ele = ele
        this.isSupportTouch = "ontouchend" in document ? true : false;
        this.bindEvent()
    }

    bindEvent(){
        if(this.isSupportTouch){
          this.ele.addEventListener('touchstart', this.touchstart.bind(this))
          this.ele.addEventListener('touchmove', this.touchmove.bind(this))
          this.ele.addEventListener('touchend', this.touchend.bind(this))
          this.ele.addEventListener('touchcancel', this.touchcancel.bind(this))
        }else{
          this.ele.addEventListener('mousedown', this.touchstart.bind(this))
          this.ele.addEventListener('mousemove', this.touchmove.bind(this))
          this.ele.addEventListener('mouseup', this.touchend.bind(this))
          this.ele.addEventListener('mouseout', this.touchcancel.bind(this))
        }
    }

    private touchstart(event: TouchEvent | MouseEvent) {
        console.log('mousedown')
        if(!this.isSupportTouch){
            event.preventDefault()
        }
        this.mouseDown = true
        this.emit('drag:start')
        this.originX = this.isSupportTouch ?  (<TouchEvent>event).changedTouches[0].clientX : (<MouseEvent>event).clientX
        this.originY = this.isSupportTouch ? (<TouchEvent>event).changedTouches[0].clientY : (<MouseEvent>event).clientY
    }

    private touchmove(event: TouchEvent | MouseEvent) {
        if(this.mouseDown){
            console.log('%c touchmove', 'color: green')
            this.emit('drag:move')
        }
    }

    private touchend(event: TouchEvent | MouseEvent) {
        this.mouseDown = false
        console.log('%c touchend', 'color: red')
        const endX = this.isSupportTouch ?  (<TouchEvent>event).changedTouches[0].clientX : (<MouseEvent>event).clientX
        const endY = this.isSupportTouch ? (<TouchEvent>event).changedTouches[0].clientY : (<MouseEvent>event).clientY

        const offsetX = endX - this.originX
        const offsetY = endY - this.originY

        this.emit('drag:end', offsetX)
    }

    private touchcancel(event: TouchEvent | MouseEvent){
        this.mouseDown = false
        this.emit('drag:cancel')
        console.log('%c touchcancel', 'color: orange')
    }
}