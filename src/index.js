import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import useComponentSize from '@rehooks/component-size'

import CirclePacker from './circlepacker.es6.js'
import createCircle from './createCircle'
import './styles.css'

function CirclePackerComponent({ 
  children,
  className,
  collisionPasses = 3,
  centeringPasses = 1,
  damping = 0.025,
}) {

  let ref = useRef(null)
  let circleRef = useRef(null)
  let bounds = useComponentSize(ref)

  const packer = useRef(null)
  
  
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

  const circles = children.map(child => createCircle(child, bounds))
  
  useEffect(() => {
    const target = { x: bounds.width * 0.5, y: bounds.height * 0.5 };
    
    packer.current = new CirclePacker({
      bounds,
      target,
      circles,
      onMove: render,
      collisionPasses,
      centeringPasses,
    })
    packer.current.setDamping(damping)
    
    return () => {
      packer.current.destroy()
    }
  }, [bounds, circles, collisionPasses, centeringPasses, damping])


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
    <div className={`circle-container ${className}`} ref={ref}>
      {circles.map(el => (
        <div
          key={el.id}
          ref={circleRef}
          id={el.id}
          data-x={el.x}
          data-y={el.y}
          data-radius={el.radius}
          className="circle" 
          style={{
            width: `${el.diameter}px`,
            height: `${el.diameter}px`,
            // transform: `translate3d(${el.position.x}px, ${el.position.y}px, 0)`,
            borderRadius: `${el.diameter}px`,
          }}
          // TODO: touch
          onMouseDown={(e) => {
            const circle = circles.find(x => x.id === e.target.id)
            circlePressed(e.target, circle, e)
          }}
        >
          {children.map(child => {
            console.log(child.key, el.id)
            
            if (child.key === el.id) {
              return (
              <div className="test">
                {child}
              </div>

              )
            }
          })}
          
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <article className="text">

        <CirclePackerComponent
          className="wrappeyboy"
          centeringPasses={3}
          collisionPasses={3}
          damping={0.008}
        >

          <div key="circle-1" className="circle-content" data-x={-900} data-y={-200}>
            <h2>circle 1</h2>
            <p>bit of content here for it</p>
          </div>
          <div key="circle-2" className="circle-content" data-x={0} data-y={0}>
            <h2>222</h2>
            <p>hows it sllllooeong</p>
          </div>
          <div key="circle-3" className="circle-content" data-x={50} data-y={-50}>
            <h2>and a bit more</h2>
            <p>antlers are cool</p>
          </div>
        </CirclePackerComponent>

      </article>
      
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
