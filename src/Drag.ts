interface callbackFunc {
    (offsetX: number, offsetY: number): void;
}

export default class Drag {
    private ele: Element
    private isSupportTouch: boolean
    private cb: Function
    private originX: number 
    private originY: number

    constructor(ele: Element, cb: (offsetX: number, offsetY: number) => void){
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

    public touchstart = function(event: TouchEvent | MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.mousedowned = true
        console.log('mousedownHandler')
        this.originX = this.isSupportTouch ?  (<TouchEvent>event).changedTouches[0].clientX : (<MouseEvent>event).clientX
        this.originY = this.isSupportTouch ? (<TouchEvent>event).changedTouches[0].clientY : (<MouseEvent>event).clientY
    }

    public touchmove = function(event: TouchEvent | MouseEvent) {
        console.log('touchmove')
    }

    public touchend = function(event: TouchEvent | MouseEvent) {
        this.endX = this.isSupportTouch ?  (<TouchEvent>event).changedTouches[0].clientX : (<MouseEvent>event).clientX
        this.endY = this.isSupportTouch ? (<TouchEvent>event).changedTouches[0].clientY : (<MouseEvent>event).clientY

        const offsetX = this.endX - this.originX
        const offsetY = this.endY - this.originY
        this.cb(offsetX, offsetY)
    }

    private touchcancel(event: TouchEvent | MouseEvent){
        console.log('touchcancel')
    }
}