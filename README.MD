# Swiper3D

> A simple 3d swiper

## demo

```
    npm install && npm run dev
```


## usage
### init
```
    var mySwiper = new Swiper3D('.swiper-container', {
          loop: true,
          showNum: 7,
          start: 0,
          offsets: {
              0: 0.1,
              6: 0.1,
          }
        })
        
    mySwiper.on('change', function(current){
        console.log(current)
    })

```

### api
- next
- prev
- jump
- on