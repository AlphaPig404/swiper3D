import * as EventEmitter from 'eventemitter3';
import './css/index.scss';
import Drag from './Drag';

interface Offsets {
    [index: number]: number
}

interface Options {
    loop?: boolean,
    start?: number,
    showNum?: number,
    offsets?: Offsets
}

const defaultOpitons:Options = {
    showNum: 5,
    start: 0,
    loop: false
}


export class Swiper3D extends EventEmitter{
    private options: Options
    private $swiper: HTMLElement
    private $wrapper: HTMLElement
    private slides: NodeListOf<Element>
    private styleList: string[] = []
    private currentIndex: number = 0
    private middleIndex: number = 0
    private intervalID: number
    private emmitClick: boolean
    
    constructor(container: string|HTMLElement, options: Options){
        super()
        this.options = {...defaultOpitons, ...options}
        this.$swiper = typeof container === 'string' ? document.querySelector(container) : container 
        this.$wrapper = this.$swiper.querySelector('.swiper-wrapper')
        this.slides = this.$swiper.querySelectorAll('.swiper-slide')
        this.checkOptions(this.options)
        this.init()
    }

    private init(){
        this.middleIndex = Math.floor(this.options.showNum / 2)
        const currentIndex:number = this.options.start
        const hiddenStyle:string = `
            transition: all 0.35s ease;
            transform: translate3d(0,0,0) scale(0.2);
            opacity: 0;
            z-index: -100;
        `
        let itemMaxWidth: number = 0
        let itemMaxHeight: number = 0


        this.forEach(this.slides, (slide: HTMLElement, index) => {
            const SCALE_BASE = 0.8
            const ROTATE = 60

            const showIndex = index - this.middleIndex
            const sign = Math.sign(showIndex)
            const absShowIndex = Math.abs(showIndex)
            const offset = this.options.offsets[index] || 0

            const translateX: number = (1 - 1/Math.pow(2, absShowIndex) + offset)*sign 
            const rotateY: number = showIndex ? - sign*ROTATE : 0
            const scale:number = Math.pow(SCALE_BASE, absShowIndex)
            const brightness = 1 - absShowIndex/10
            

            const zIndex: number = showIndex === 0 ? 999 : absShowIndex
            
            const cssText = `
                transition: all 0.35s ease;
                transform: translateX(${translateX*100}%) rotateY(${rotateY}deg) translateZ(1px) scale(${scale});
                z-index: ${zIndex};
                opacity: ${1 - absShowIndex*0.01};
                filter: brightness(${brightness});
                
            `

            if(index < this.options.showNum){
                this.styleList.push(cssText)
            }else{
                this.styleList.push(hiddenStyle)
            }

            slide.dataset.index = "" + index

            const width = slide.offsetWidth
            const height = slide.offsetHeight

            itemMaxWidth = width > itemMaxWidth ? width : itemMaxWidth
            itemMaxHeight = height > itemMaxHeight ? height : itemMaxHeight
        })

        this.jump(currentIndex)

        if(this.options.loop){
            this.intervalID = window.setInterval(this.next.bind(this), 5000)
        }

        this.$wrapper.style.width = itemMaxWidth + 'px'
        this.$wrapper.style.height = itemMaxHeight + 'px'

        this.$wrapper.addEventListener('click', (event:MouseEvent)=>{
            if(this.emmitClick){
                const target = this.getNode(<HTMLButtonElement>event.target, 'swiper-slide')
                this.emmitClick = false
                if(target.dataset){
                    this.jump(+target.dataset.index)
                }
            }else{

            } 
        })

        const dragEle = new Drag(this.$wrapper, (x: number, y: number)=>{
            if(Math.abs(x) > 10){
                this.emmitClick = false
                if(x > 50){
                    this.prev()
                }
                else if(x < -50){
                    this.next()
                    
                }
            }else{
                this.emmitClick = true
            }
        })
    }

    public prev() {
        this.currentIndex -= 1
        this.updateView()
    }

    public next(){
        this.currentIndex += 1
        this.updateView()
    }

    public jump(index: number){
        this.currentIndex = index
        this.updateView()
    }

    public clearTimer(){
        window.clearInterval(this.intervalID)
    }

    private getNode(ele: Element, tag: string): any{
        if(ele.classList.contains(tag)){
            return ele
        }else if(ele.nodeName === 'BODY'){
           return HTMLBodyElement
        }else{
            return this.getNode(ele.parentElement, tag)
        }
    }

    private updateView(){
        this.forEach(this.slides, (slide, index) => {
            let _index =  (index - this.currentIndex + this.middleIndex) % this.slides.length
            if(_index < 0) {
                _index += this.slides.length
            }

            slide.style.cssText = this.styleList[_index]
        })
        this.emit('change', this.currentIndex)
    }

    private forEach(list: ArrayLike<any>, cb: (item: any, index: number) => void){
        for(let i = 0; i < list.length; i++){
          cb(list[i], i)
        }
    }

    private checkOptions(options: Options){
        if(!(options.showNum % 2) || options.showNum < 3 || options.showNum > this.slides.length){
            throw Error(`showNum must be odd number >= 3 && <= ${this.slides.length}`)
        }
        if(options.start < 0 || options.start > this.slides.length - 1){
            throw Error(`start cross the border, must in [0, ${this.slides.length})`)
        }
        return true
    }
}

