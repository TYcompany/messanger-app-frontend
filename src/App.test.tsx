import { render, screen } from '@testing-library/react';
import App from './App';

const navLinks = [{
  title: 'Home', href: "/"
},
{
  title: 'Register', href: "/register"
},
{
  title: 'Login', href: "/login"
},
{
  title: 'SetProfile', href: "/setProfile"
},
{
  title: 'Chat', href: "/chat"
}]

test('navLink', async () => {
  const { findByText } = await render(<App />)
  for(const navLink of navLinks){
    const{title,href}=navLink;
    const component=await screen.findByText(title);
    expect(component.getAttribute('href')).toBe(href);
  }
});
