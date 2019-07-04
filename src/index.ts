import EventEmitter from 'eventemitter3';
import './css/index.scss';

interface Options {
    loop?: boolean,
    start?: number,
    showNum?: number
}

const defaultOpitons:Options = {
    showNum: 5,
    start: 0,
    loop: false
}


class Swiper3D extends EventEmitter{
    private options: Options
    private $swiper: HTMLElement
    private slides: NodeListOf<Element>
    private styleList: string[] = []
    private currentIndex: number = 0
    private middleIndex: number = 0
    

    constructor(container: string|HTMLElement, options: Options){
        super()
        this.options = {...defaultOpitons, ...options}
        this.$swiper = typeof container === 'string' ? document.querySelector(container) : container 
      
        this.slides = this.$swiper.querySelectorAll('.swiper-slide')
        this.checkOptions(this.options)
        this.init()
    }

    private init(){
        this.currentIndex = this.options.start
        this.middleIndex = Math.floor(this.slides.length / 2)

        this.forEach(this.slides, (slide: HTMLElement, index) => {
            const SCALE_BASE = 0.8
            const ROTATE = 60

            const showIndex = index - this.middleIndex
            const sign = Math.sign(showIndex)
            const absShowIndex = Math.abs(showIndex)

            const translateX: number = (1 - 1/Math.pow(2, absShowIndex))*sign
            const rotateY: number = showIndex ? - sign*ROTATE : 0
            const scale:number = Math.pow(SCALE_BASE, absShowIndex)

            const zIndex: number = showIndex === 0 ? 0 : - absShowIndex
            
            const cssText = `
                transition: all 0.3s ease;
                transform: translateX(${translateX*100}%) rotateY(${rotateY}deg) scale(${scale});
                z-index: ${zIndex};
            `
            this.styleList.push(cssText)

            slide.style.cssText = cssText
            slide.dataset.index = "" + showIndex
            slide.addEventListener('click', (event:MouseEvent)=>{
                const target = <HTMLButtonElement>event.target
                this.jump(+target.dataset.index)
            })
        })
        if(this.options.loop){
            setInterval(this.next.bind(this), 1000)
        }
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

    private updateView(){
        this.forEach(this.slides, (slide, index) => {
            let _index =  (index - this.currentIndex ) % this.slides.length

            if(_index < 0) {
                _index += this.slides.length
            }

            slide.style.cssText = this.styleList[_index]
        })
    }

    private forEach(list: ArrayLike<any>, cb: (item: any, index: number) => void){
        for(let i = 0; i < list.length; i++){
          cb(list[i], i)
        }
    }

    private checkOptions(options: Options){
        if(!(options.showNum % 2 || options.showNum < 3)){
            throw Error('showNum must be odd number >= 3')
        }
        if(options.start < 0 || options.start > this.slides.length - 1){
            throw Error(`start cross the border, must in [0, ${this.slides.length})`)
        }
        return true
    }
}

declare global {
    interface Window { Swiper3D: any; }
}

window.Swiper3D = Swiper3D;
