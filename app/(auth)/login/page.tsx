import { signUpAction } from './_actions/sign-up-action';
import { loginAction } from './_actions/login-action';

export default function LoginPage() {
  return (
    <div>
      <h2>Login Page</h2>
      <form>
        <label htmlFor="name">Name:</label>
        <input id="name" name="name" type="text" required />
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={loginAction}>Log in</button>
        <button formAction={signUpAction}>Sign up</button>
      </form>
    </div>
  );
}
