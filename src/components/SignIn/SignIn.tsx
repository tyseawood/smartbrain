import React from "react";
import {UserData} from "../../App.tsx";

interface SignInProps {
    onRouteChange: (route: string) => void
    onEmailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmitSignIn?: () => void
    loadUser: (user: UserData) => void
}

interface SignInState {
    signInEmail: string,
    signInPassword: string
}

class SignIn extends React.Component<SignInProps, SignInState> {
    constructor(props: SignInProps) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({signInEmail: e.target.value})
    }
    onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({signInPassword: e.target.value})
    }
    onSubmitSignIn = () => {
        fetch('http://localhost:4000/sign-in', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user)
                    this.props.onRouteChange('home')
                }
            })
    }

    render() {
        const {onRouteChange} = this.props
        return (
            <>
                <article
                    className={
                        'br2 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'
                    }
                >
                    <main className="pa4 black-80">
                        <div className="measure ">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0 center">Sign In</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">
                                        Email
                                    </label>
                                    <input
                                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                        type="email"
                                        name="email-address"
                                        id="email-address"
                                        onChange={this.onEmailChange}

                                    />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                        type="password"
                                        name="password"
                                        id="password"
                                        onChange={this.onPasswordChange}
                                    />
                                </div>
                            </fieldset>
                            <div className="">
                                <input
                                    onClick={this.onSubmitSignIn}
                                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                    type="submit"
                                    value="Sign in"
                                />
                            </div>
                            <div className="lh-copy mt3">
                                <p
                                    onClick={() => onRouteChange('register')}
                                    className="f6 link dim black db pointer"
                                >
                                    Register
                                </p>
                            </div>
                        </div>
                    </main>
                </article>
            </>
        )
    }

}

export default SignIn
