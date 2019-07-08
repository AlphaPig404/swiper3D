interface callbackFunc {
    (offsetX: number, offsetY: number): void;
}

export default class Drag {
    private ele: Element
    private isSupportTouch: boolean
    private cb: callbackFunc
    private originX: number 
    private originY: number
    private mouseDown: boolean

    constructor(ele: Element, cb: callbackFunc){
        // super()
        this.ele = ele
        this.isSupportTouch = "ontouchend" in document ? true : false;
        this.cb = cb
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
        console.log('mousedownHandler')
        this.mouseDown = true
        this.originX = this.isSupportTouch ?  (<TouchEvent>event).changedTouches[0].clientX : (<MouseEvent>event).clientX
        this.originY = this.isSupportTouch ? (<TouchEvent>event).changedTouches[0].clientY : (<MouseEvent>event).clientY
    }

    private touchmove(event: TouchEvent | MouseEvent) {
        if(this.mouseDown){
            console.log('touchmove')
        }
    }

    private touchend(event: TouchEvent | MouseEvent) {
        this.mouseDown = false
        const endX = this.isSupportTouch ?  (<TouchEvent>event).changedTouches[0].clientX : (<MouseEvent>event).clientX
        const endY = this.isSupportTouch ? (<TouchEvent>event).changedTouches[0].clientY : (<MouseEvent>event).clientY

        const offsetX = endX - this.originX
        const offsetY = endY - this.originY
        this.cb(offsetX, offsetY)
    }

    private touchcancel(event: TouchEvent | MouseEvent){
        this.mouseDown = false
        console.log('touchcancel')
    }
}