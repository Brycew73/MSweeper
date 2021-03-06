document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    /*
        Variables that are important to note:
        - Size is the i x i generation of the map 8x8(Easy), 10x10(Medium), 12x12(Hard)
            NOTE: size is connected to the height&width in the style.css
        
    */
    let size = 10
    let numBombs = 20
    let numflags = 0
    let map = []
    let isGameOver = false
    
    /*
        There are several changes I made to our code when moving it to javascript:
        - The visable and hidden maps no longer exist. It was far more efficient to store 'bomb' and 'safe'
            and then build test statements based on those conditions. 
        - placeBombs() and placeNumbers() are now included in the initBoard function 
        - map is now a 2d array with autowrapping
        - 
        
    */
    function initBoard(){
        //place bombs
        var bombMap = Array(numBombs).fill('bomb') //create x amount of bombs
        var emptyMap = Array(size * size - numBombs).fill('safe') // create x amount of empty spaces
        var visableMap = emptyMap.concat(bombMap) // combine the two previous arrays (not random yet)
        visableMap = visableMap.sort(() => Math.random() - 0.5) //shuffle array
        //
        
        for(let i = 0; i < size * size; i++){
            const tile = document.createElement('div')
            tile.setAttribute('id',i)
            tile.classList.add(visableMap[i])
            grid.appendChild(tile)
            map.push(tile)
            
            tile.addEventListener('click', function(e){
                if(tile.classList.contains('bomb')){
                    gameOver(tile)
                }       
                click(tile)                  
            })
            
            tile.oncontextmenu = function(e){
                e.preventDefault()
                addFlag(tile)
            }
            
        }
        
        //placeNumbers()
        for(let i = 0; i< map.length; i++){
            var total = 0
            var isLeftEdge = (i % size === 0) // index of the first in each row (left)
            var isRightEdge = (i % size === size-1)// index of the last in each row (right)
            
            if(map[i].classList.contains('safe')){
                if( i> 0 && !isLeftEdge && map[i-1].classList.contains('bomb')){                                //1
                    total++ // NOT index[0] & NOT leftEdge => checkWest (Left)
                }
                if( i> (size-1) && !isRightEdge && map[i+1].classList.contains('bomb')){                        //2
                    total++ //checkEast (Right)
                }
                if( i> size && map[i-size].classList.contains('bomb')){                                         //3
                    total++ //NOT first row , checkNorth
                }
                if( i > (size-1) && !isRightEdge && map[i+1-size].classList.contains('bomb')){
                    total++ // checkNorthEast
                }
                if( i> (size+1) && !isLeftEdge && map[i-1-size].classList.contains('bomb')){                    //4
                    total++ // NOT left edge, checkNorthWest 
                }
                if( i< (size*size)-1 && map[i].classList.contains('bomb')){                                     //5
                    total++ // BOTTOM row, checkEast (Right)
                }
                if( i< (size * (size-1)-1) && !isLeftEdge && map[i-1+size].classList.contains('bomb')){         //6 
                    total++ // NOT bottom row, checkSouthWest
                }
                if( i< (size * (size-1)-2) && !isRightEdge && map[i+1+size].classList.contains('bomb')){        //7
                    total++ // NOT bottom row & NOT right edge, checkSouthEast
                }
                if( i< (size * (size-1)-1) && map[i+size].classList.contains('bomb') ){                         //8
                    total++ // NOT bottom row, checkSouth (Down)
                }
                if( i< (size*size) && map[i].classList.contains('bomb')){
                    total++
                }
                
        
                
                
                map[i].setAttribute('data',total)
                //console.log(map[i])
                
            } 
        }
    }
    initBoard()
    
    function addFlag(tile){
        if(isGameOver) return
        if(!tile.classList.contains('checked') && (numflags < numBombs)){
            if(!tile.classList.contains('flag')){
                tile.classList.add('flag')
                tile.innerHTML = '/='
                numflags++
                checkWin()
            }else{
                tile.classList.remove('flag')
                tile.innerHTML = ''
                numflags -- 
            }
        }
    }
    
    function click(tile){
        let currentId = tile.id
        if (isGameOver) return
        if (tile.classList.contains('checked') || tile.classList.contains('flag')) return
        else{
            let total = tile.getAttribute('data')
            if(total != 0){
                tile.classList.add('checked')
                if (total == 1) tile.classList.add('one')
                if (total == 2) tile.classList.add('two')
                if (total == 3) tile.classList.add('three')
                if (total == 4) tile.classList.add('four')
                tile.innerHTML = total
                return
            }
            checkTile(tile,currentId)
        }
        tile.classList.add('checked')
    }
    
    function checkTile(tile,currentId){
        const isLeftEdge = (currentId % size === 0)
        const isRightEdge = (currentId % size === size-1)
        
        setTimeout(() => {
            if(currentId > 0 && !isLeftEdge){                               //1
                const newId = map[parseInt(currentId)-1].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
            if(currentId > (size-1) && !isRightEdge){                       //2
                const newId = map[parseInt(currentId) + 1 - size].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
            if (currentId > size){                                          //3 p 
                const newId = map[parseInt(currentId - size)].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
            if (currentId > (size+1) && !isLeftEdge){                       //4 p
                const newId = map[parseInt(currentId) - 1 - size].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
            if (currentId < (size*size)-1 && !isRightEdge){                 //5 p 
                const newId = map[parseInt(currentId)+1].id             // last row
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
            if(currentId < (size * (size-1))  && !isLeftEdge){              //6 p
                const newId = map[parseInt(currentId)-1 + size].id      // second to last (not left)
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
            if(currentId < (size * (size-1))  && !isRightEdge){           //7 p
                const newId = map[parseInt(currentId)+1 + size].id      // second to last (not right side)
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
            if(currentId < (size * (size-1))){                            //8 p
                const newId = map[parseInt(currentId)+ size].id         // second to last row
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            
        }, 10)
    }
                          
    function gameOver(tile){
        console.log('GAME OVER!')
        isGameOver = true
        map.forEach(tile => {
            if(tile.classList.contains('bomb')){
                tile.innerHTML = 'BOMB'
                tile.classList.remove('bomb')
                tile.classList.add('checked')
            }
        })
    }
    
    function checkWin(){
        let correctFlags = 0
        for(let i = 0; i<map.length; i++){
            if(map[i].classList.contains('flag') && map[i].classList.contains('bomb')){
                correctFlags++
            }
            if(correctFlags === numBombs){
                console.log('YOU WIN')
            }
        }
    }
                          
                          
})