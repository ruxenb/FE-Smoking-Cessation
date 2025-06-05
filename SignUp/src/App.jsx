import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div class="container--0-">
    <form class="container-0-1-0" action="#" method="POST">
      <div class="container-1-2-0">
        <label for="email" class="text-2-3-0">Email</label>
        <div class="container-2-3-2">
          <input type="email" id="email" name="email" placeholder="Enter your email" required/>
        </div>
      </div>

      <div class="container-1-2-1">
        <label for="password" class="text-2-3-0">Password</label>
        <div class="container-2-3-2">
          <input type="password" id="password" name="password" placeholder="Enter your password (min. 8 characters)" required minlength="8"/>
        </div>
      </div>

      <div class="container-1-2-1">
        <label for="confirm-password" class="text-2-3-0">Confirm Password</label>
        <div class="container-2-3-2">
          <input type="password" id="confirm-password" name="confirm-password" placeholder="Re-enter your password" required minlength="8"/>
        </div>
      </div>

      <div class="container-1-2-2">
        <div class="container-2-3-0">
          <input type="checkbox" id="newsletter" name="newsletter"/>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_33_82)">
              <path
                d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V12C16 14.2091 14.2091 16 12 16H4C1.79086 16 0 14.2091 0 12V4Z"
                fill="#2C2C2C"
              ></path>
              <path
                d="M13.3332 4L5.99984 11.3333L2.6665 8"
                stroke="#F5F5F5"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_33_82">
                <path
                  d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V12C16 14.2091 14.2091 16 12 16H4C1.79086 16 0 14.2091 0 12V4Z"
                  fill="white"
                ></path>
              </clipPath>
            </defs>
          </svg>
          <label for="newsletter" class="text-3-4-1">Receive our news and sales via email</label>
        </div>
      </div>

      <div class="container-1-2-3">
        <div class="container-2-3-1">
          <button type="submit">Register</button>
        </div>
      </div>
    </form>

    <div class="text-0-1-1">Already have an account? <a href="#">Sign in</a></div>
  </div>

  )
}

export default App
