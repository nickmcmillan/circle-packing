import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'


import CirclePacker from './circlepacker.es6.js'
import './styles.css'

setTimeout(() => {

  var DRAG_THRESOLD = 10;
  var containerEl = document.querySelector('.container');
  var addButtonEl = document.querySelector('#add-circle');
  var deleteButtonEl = document.querySelector('#delete-circle');
  var randomButtonEl = document.querySelector('#random-size');
  // references to all circle elements
  var circleEls = {};
  // dimenstions of container
  var rect = containerEl.getBoundingClientRect();
  const bounds = { width: rect.width, height: rect.height };
  var target = { x: bounds.width / 2, y: bounds.height / 2 };
  let isDragging = false
  
  var circles = [
    createCircle(),
    createCircle(),
    createCircle(),
    createCircle(),
    createCircle()
  ];
  const packer = new CirclePacker({
    bounds,
    target,
    circles,
    onMove: render,
    collisionPasses: 3,
    centeringPasses: 2,
  });
  // packer.setDamping(0.025)
  addButtonEl.addEventListener('click', addRandomCircle);
  deleteButtonEl.addEventListener('click', removeRandomCircle);
  randomButtonEl.addEventListener('click', setRandomBounds);
  function addRandomCircle() {
    packer.addCircle(createCircle());
  }
  // create circle dom object, return circle data
  function createCircle(x, y, radius) {
    radius = radius || random(10, 40);
    x = x || random(radius, bounds.width - radius);
    y = y || random(radius, bounds.height - radius);
    const diameter = radius * 2;
    const circleEl = document.createElement('div');

    // need some sort of unique id...
    const id = 'circle-' + random(0, 1000, true) + '-' + Date.now();
    const circle = {
      id,
      radius,
      position: {
        x: random(radius, bounds.width - radius),
        y: random(radius, bounds.height - radius)
      }
    };
    // create circle el

    circleEl.id = id;
    circleEl.style.width = diameter + 'px';
    circleEl.style.height = diameter + 'px';
    circleEl.style.borderRadius = diameter + 'px';
    circleEl.classList.add('circle');
    // store position for dragging
    circleEl.setAttribute('data-x', x);
    circleEl.setAttribute('data-y', y);
    circleEl.setAttribute('data-radius', radius);
    // start dragging
    circleEl.addEventListener('mousedown', function (event) {
      circlePressed(circleEl, circle, event);
    });

    containerEl.appendChild(circleEl);
    circleEls[id] = circleEl;
    return circle;
  }
  function removeRandomCircle() {
    var ids = Object.keys(circleEls);
    var idToDelete = ids[random(0, ids.length, true)];
    removeCircle(idToDelete);
  }
  function setRandomBounds() {
    bounds = {
      width: random(200, 500, true),
      height: random(200, 500, true)
    };
    containerEl.style.width = bounds.width + 'px';
    containerEl.style.height = bounds.height + 'px';
    packer.setBounds(bounds);
  }
  function removeCircle(id) {
    packer.removeCircle(id);

    requestAnimationFrame(function () {
      containerEl.removeChild(circleEls[id]);
      delete circleEls[id];
    });
  }

  function render(circles) {
    requestAnimationFrame(function () {
      for (var id in circles) {
        var circleEl = circleEls[id];
        if (circleEl) {
          var circle = circles[id];
          var x = circle.position.x - circle.radius;
          var y = circle.position.y - circle.radius;
          // store position for dragging
          circleEl.setAttribute('data-x', x);
          circleEl.setAttribute('data-y', y);
          // actually move the circles around
          circleEl.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
          circleEl.classList.add('is-visible');
        }
      }
    });
  }
  // start and stop dragging
  function circlePressed(circleEl, circle, event) {
    var circleStartPos = {
      x: parseFloat(circleEl.getAttribute('data-x')) + circle.radius,
      y: parseFloat(circleEl.getAttribute('data-y')) + circle.radius
    };
    var eventStartPos = { x: event.clientX, y: event.clientY };

    function dragStart() {
      document.addEventListener('mousemove', dragged);
      document.addEventListener('mouseup', dragEnd);
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
          dragEnd();
        } else {
          packer.drag(circle.id, newPos);
        }
      }
    }
    function dragEnd() {
      isDragging = false;
      document.removeEventListener('mousemove', dragged);
      packer.dragEnd(circle.id);
    }
    if (!isDragging) {
      dragStart();
    }
  }
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

}, 1000)

function App() {

  useEffect(() => {
    
    return () => {
      
    };
  }, [])
  return (
    <div className="App">
      <article className="text">
        <p className="container"></p>
        <button id="add-circle">add circle</button>
        <button id="delete-circle">delete circle</button>
        <button id="random-size">random size</button>
        {/* <div className="range-container"> */}
          {/* <label htmlFor="damping">damping</label> */}
          {/* <input id="damping" type="range" min="0" max="0.05" step="0.001" value="0.025" /> */}
          {/* <span id="damping-value">0.025</span> */}
        {/* </div> */}
      </article>
      
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
