import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import CirclePacker from './circlepacker.es6.js'
import './styles.css'


// create circle dom object, return circle data
function createCircle(child) {
  const radius = 40
  const x = 0 //|| random(radius, bounds.width - radius);
  const y = 0//y || random(radius, bounds.height - radius);
  const diameter = radius * 2;

  return {
    id: child.props['data-id'],
    position: {
      x: 150 + Math.random(),//random(radius, bounds.width - radius),
      y: 150 + Math.random(),//random(radius, bounds.height - radius)
    },
    width: diameter + 'px',
    height: diameter + 'px',
    borderRadius: diameter + 'px',
    x,
    y,
    radius,
  };

}

function Circle({children}) {

  const packer = useRef(null)
  
  const bounds = { width: 300, height: 300 }; // TODO: get dynbamic sizes
  // const bounds = { width: rect.width, height: rect.height };
  const target = { x: bounds.width * 0.5, y: bounds.height * 0.5 };
  let isDragging = false

  // start and stop dragging
  function circlePressed(circleEl, circle, e) {
    
    const circleStartPos = {
      x: parseFloat(circleEl.getAttribute('data-x')) + circle.radius,
      y: parseFloat(circleEl.getAttribute('data-y')) + circle.radius
    };

    const eventStartPos = { x: e.clientX, y: e.clientY };

    function dragStart() {
      document.addEventListener('mousemove', dragged)
      document.addEventListener('mouseup', dragEnd)
    }

    function dragged(e) {
      const currentPos = { x: e.clientX, y: e.clientY };
      const delta = {
        x: currentPos.x - eventStartPos.x,
        y: currentPos.y - eventStartPos.y
      };

      // start dragging if mouse moved DRAG_THRESOLD px
      if (!isDragging) {
        isDragging = true;
        packer.current.dragStart(circle.id);
      }

      
      if (isDragging) {
        // end dragging if circle is outside the bounds
        const newPos = { x: circleStartPos.x + delta.x, y: circleStartPos.y + delta.y };
        if (
          newPos.x < circle.radius || newPos.x > bounds.width - circle.radius ||
          newPos.y < circle.radius || newPos.y > bounds.height - circle.radius
        ) {
          dragEnd();
        } else {
          packer.current.drag(circle.id, newPos);
        }
      }
    }

    function dragEnd() {
      isDragging = false;
      document.removeEventListener('mousemove', dragged);
      packer.current.dragEnd(circle.id);
    }

    if (!isDragging) {
      dragStart();
    }
  }

  const circles = children.map(child => createCircle(child))

  useEffect(() => {
    packer.current = new CirclePacker({
      bounds,
      target,
      circles,
      onMove: render,
      collisionPasses: 3,
      centeringPasses: 1,
    })
    packer.current.setDamping(0.025)
    
    return () => {
      packer.current.destroy()
    }
  }, [])


  function render(update) {

    requestAnimationFrame(function () {

      for (const id in update) {
        const x = update[id].position.x - update[id].radius
        const y = update[id].position.y - update[id].radius

        // bypassing reacts render method
        const circleEl = document.getElementById(id)
        circleEl.style.transform = `translate3d(${x}px, ${y}px, 0)`
        
        // store position for dragging
        circleEl.setAttribute('data-x', x)
        circleEl.setAttribute('data-y', y)
      }
    })
  }
  

  return (
    <>
      <div className="container">
        {circles.map((el, i) => (
          <div
            key={i}
            id={el.id}
            data-x={el.x}
            data-y={el.y}
            data-radius={el.radius}
            className="is-visible circle" 
            style={{
              width: el.width,
              height: el.height,
              transform: `translate(${el.x}px, ${el.y}px)`,
              borderRadius: el.borderRadius,
            }}
            // TODO: touch
            onMouseDown={(e) => {
              const circle = circles.find(x => x.id === e.target.id)
              circlePressed(e.target, circle, e, packer)
            }}
          >
            {children.find(({props}) => props['data-id'] === el.id)}
          </div>
        ))}
      </div>
    </>
  )
}

function App() {
  return (
    <div className="App">
      <article className="text">

        <Circle>
          <div data-id="circle-1" className="circle-content">
            <h2>circle 1</h2>
            <p>bit of content here for it</p>
          </div>
          <div data-id="circle-2" className="circle-content">
            <h2>222</h2>
            <p>hows it sllllooeong</p>
          </div>
          <div data-id="circle-3" className="circle-content">
            <h2>and a bit more</h2>
            <p>antlers are cool</p>
          </div>
        </Circle>

      </article>
      
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
