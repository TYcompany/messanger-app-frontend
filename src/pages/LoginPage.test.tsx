import { fireEvent, render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';
import {BrowserRouter} from 'react-router-dom'

const setup =()=>{
  render(<BrowserRouter>
    <LoginPage />
</BrowserRouter>)
}

describe('LoginPage',()=>{
    test('render title test',async()=>{
      setup();
      const component=await screen.findByText(/Login Page/i);
      expect(component).toBeTruthy();
    })
    test('LoginButton test',async()=>{
      setup();
      const buttons =await screen.findAllByRole('button')
      const loginButton = buttons.filter((button:any)=>button.innerHTML==='Login')[0]
      expect(loginButton).toBeTruthy();

      //fireEvent.click(loginButton)
      //await loginButton[0].click();
      // await new Promise((r) => setTimeout(r, 1000));
     
      //   const toastComponent=await screen.findByText(/userName should longer than 5 characters!/i)
      //   expect(toastComponent).toBeTruthy();
    
    })
})

// test('navLink', async () => {
//   const { findByText } = render(<LoginPage />)
  
//     const component=await screen.findByText(title);
//     expect(component.getAttribute('href')).toBe(href);
  
// });
