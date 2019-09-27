import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import CirclePacker from './circlepacker.es6.js'
import './styles.css'

function random(min, max, intResult) {
  if (typeof min !== 'number' && typeof max !== 'number') {
    min = 0;
    max = 1;
  }
  if (typeof max !== 'number') {
    max = min;
    min = 0;
  }
  var result = min + Math.random() * (max - min);
  if (intResult) {
    result = parseInt(result, 10);
  }
  return result;
}

function Circle({children}) {

  var DRAG_THRESOLD = 10;
  // var containerEl = document.querySelector('.container');
  // references to all circle elements
  // dimenstions of container
  // var rect = containerEl.getBoundingClientRect();
  const bounds = { width: 300, height: 300 };
  // const bounds = { width: rect.width, height: rect.height };
  var target = { x: bounds.width / 2, y: bounds.height / 2 };
  let isDragging = false

  // create circle dom object, return circle data
  function createCircle(child) {
    const radius = 40//radius || random(10, 40);
    const x = 10 //|| random(radius, bounds.width - radius);
    const y = 10//y || random(radius, bounds.height - radius);
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
    // create circle el

    // circleEl.id = id;
    // circleEl.style.width = diameter + 'px';
    // circleEl.style.height = diameter + 'px';
    // circleEl.style.borderRadius = diameter + 'px';
    // circleEl.classList.add('circle');
    // // store position for dragging
    // circleEl.setAttribute('data-x', x);
    // circleEl.setAttribute('data-y', y);
    // circleEl.setAttribute('data-radius', radius);
    // // start dragging
    // circleEl.addEventListener('mousedown', function (event) {
    //   circlePressed(circleEl, circle, event);
    // });

    // containerEl.appendChild(circleEl);
    // circleEls[id] = circleEl;
    // console.log(circleEl)

  }

  const circles = children.map(child => createCircle(child))

  const packer = new CirclePacker({
    bounds,
    target,
    circles,
    onMove: render,
    collisionPasses: 3,
    centeringPasses: 2,
  });
  // packer.setDamping(0.025) //

  

  function render(hum) {

    // return
    requestAnimationFrame(function () {

      for (const id in hum) {
        

        var circleBoy = hum[id]//circles.find(x => x.id === id);
// /
        // console.log({circleBoy, id, })
        

        // const currentCirc = circles.find(x => x.id === id)

        var x = hum[id].position.x - hum[id].radius;
        var y = hum[id].position.y - hum[id].radius;

        // currentCirc.position.x = x
        // currentCirc.position.y = y
        // currentCirc.x = x
        // currentCirc.y = y

        const circleEl = document.getElementById(id)
        circleEl.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
        
        // store position for dragging
        
        circleEl.setAttribute('data-x', x);
        circleEl.setAttribute('data-y', y);
        // actually move the circles around
        
        // circleEl.classList.add('is-visible');

        

        // circles.forEach(one => {
        //   one.circle.x = circleBoy.position.x - circleBoy.radius
        //   one.circle.y = circleBoy.position.y - circleBoy.radius
        // })

        // continue

        
        // if (circleEl) {
        //   var cock = circles.find(x => x.circle.id === id);

          
        //   var x = cock.circle.x - cock.circle.radius;
        //   var y = cock.circle.y - cock.circle.radius;
        //   // store position for dragging
        //   var dataX = x
        //   var dataY = y
        //   // circleEl.setAttribute('data-x', x);
        //   // circleEl.setAttribute('data-y', y);
        //   // actually move the circles around
        //   // circleEl.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
        //   // circleEl.classList.add('is-visible');

        // }
      }

    });
  }
  // start and stop dragging
  function circlePressed(circleEl, circle, event, packer) {
    var circleStartPos = {
      x: parseFloat(circleEl.getAttribute('data-x')) + circle.radius,
      y: parseFloat(circleEl.getAttribute('data-y')) + circle.radius
    };
    var eventStartPos = { x: event.clientX, y: event.clientY };

    function dragStart() {
      document.addEventListener('mousemove', dragged);
      document.addEventListener('mouseup', () => dragEnd(packer));
    }
    function dragged(event) {
      var currentPos = { x: event.clientX, y: event.clientY };
      var delta = {
        x: currentPos.x - eventStartPos.x,
        y: currentPos.y - eventStartPos.y
      };
      // start dragging if mouse moved DRAG_THRESOLD px
      if (!isDragging &&
        (Math.abs(delta.x) > DRAG_THRESOLD || Math.abs(delta.y) > DRAG_THRESOLD)
      ) {
        isDragging = true;
        packer.dragStart(circle.id);
      }
      var newPos = { x: circleStartPos.x + delta.x, y: circleStartPos.y + delta.y };
      if (isDragging) {
        // end dragging if circle is outside the bounds
        if (
          newPos.x < circle.radius || newPos.x > bounds.width - circle.radius ||
          newPos.y < circle.radius || newPos.y > bounds.height - circle.radius
        ) {
          dragEnd(packer);
        } else {
          packer.drag(circle.id, newPos);
        }
      }
    }

    function dragEnd(packer) {
      isDragging = false;
      document.removeEventListener('mousemove', dragged);
      packer.dragEnd(circle.id);
    }

    if (!isDragging) {
      dragStart();
    }
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
