import React from "react";
import "./membership.css";
import { Await, Link } from "react-router-dom";
function Membership(){
  return(
    <>
    <div class="page-header">
        <h1>Succeed in quitting smoking with us</h1>
        <p>Choose the right membership plan for you to achieve your smoking cessation goals.</p>
    </div>
    <div class="membership-cards-wrapper">
    <div class="membership-card basic-plan">
    <h2>Basic</h2>
    <p class="price">Free</p>
    <p class="description">Start your smoking cessation journey with basic features.</p>
    <ul class="features-list">
        <li>Personal profile management</li>
        <li>Record smoking status</li>
        <li>Basic smoking cessation planning</li>
        <li>Record basic smoking cessation progress</li>
        <li>Receive motivational notifications</li>
        <li>View basic statistical information</li>
    </ul>
    <button class="cta-button basic-cta">Start now</button>
    </div>

    <div class="membership-card advanced-plan promoted-card">
  <span class="ribbon">Most Popular!</span> <h2>Advanced</h2>
  <p class="price">*** VND / month</p>
  <p class="description">Upgrade to receive comprehensive support and achieve the best results!</p>
  <ul class="features-list">

    <li class="highlight-feature">Advanced smoking cessation planning</li>
    <li class="highlight-feature">Record detailed smoking cessation progress</li>
    <li class="highlight-feature">Full statistics</li>
    <li class="highlight-feature">Receive full achievement badges</li>
    <li class="highlight-feature">Share badges on social media</li>
    <li class="highlight-feature">Live chat with a coach</li>
    <li class="highlight-feature">Assessment and feedback</li>
  </ul>
  <button class="cta-button advanced-cta">Upgrade now</button>
  <p class="cancellation-info">Cancel anytime.</p>
</div>
</div>

<div class="compare-table-section">
    <h2>Compare Plans</h2>
    <p>See the detailed differences between the Basic and Advanced plans to choose what suits you best.</p>

    <div class="compare-table-container">
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>Basic</th>
                    <th>Advanced</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Personal profile management</td>
                    <td><span class="icon-check">✔</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr>
                    <td>Record smoking status</td>
                    <td><span class="icon-check">✔</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr>
                    <td>Basic smoking cessation planning</td>
                    <td><span class="icon-check">✔</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr>
                    <td>Record basic smoking cessation progress</td>
                    <td><span class="icon-check">✔</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr>
                    <td>Receive motivational notifications</td>
                    <td><span class="icon-check">✔</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr>
                    <td>View basic statistical information</td>
                    <td><span class="icon-check">✔</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>

                <tr class="highlight-row">
                    <td>Advanced smoking cessation planning</td>
                    <td><span class="icon-x">✗</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr class="highlight-row">
                    <td>Record detailed smoking cessation progress</td>
                    <td><span class="icon-x">✗</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr class="highlight-row">
                    <td>Full statistics</td>
                    <td><span class="icon-x">✗</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr class="highlight-row">
                    <td>Receive full achievement badges</td>
                    <td><span class="icon-x">✗</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr class="highlight-row">
                    <td>Share badges on social media</td>
                    <td><span class="icon-x">✗</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr class="highlight-row">
                    <td>Live chat with a coach</td>
                    <td><span class="icon-x">✗</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
                <tr class="highlight-row">
                    <td>Assessment and feedback</td>
                    <td><span class="icon-x">✗</span></td>
                    <td><span class="icon-check">✔</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="faq-section">
  <h2>Frequently asked questions</h2>
  <div class="faq-item">
    <h3>How do I upgrade my account from Basic to Advanced?</h3>
    <p>You can upgrade your account anytime by clicking the "Upgrade now" button on the Advanced plan card. The system will guide you through the payment process.</p>
  </div>
  <div class="faq-item">
    <h3>What is the cancellation policy for the Advanced plan?</h3>
    <p>You can cancel your Advanced plan anytime from your account settings. The cancellation will be effective at the end of your current billing cycle.</p>
  </div>
  <div class="faq-item">
    <h3>If I cancel, will I lose my data?</h3>
    <p>No, your data will be retained. However, you will only have access to Basic plan features after your Advanced plan ends.</p>
  </div>
  </div>

  <footer>
  <p>&copy; 2025 [Your Company Name]. All rights reserved.</p>
  <p><a href="#">Terms of service</a> | <a href="#">Privacy policy</a></p>
</footer>
</>
)
}
export default Membership
