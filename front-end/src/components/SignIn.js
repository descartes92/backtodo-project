import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class SignIn extends Component {
    constructor(props) {

        super(props)

        this.state = {

            email: '',
            password: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }
    handleChange(e) {

        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        })
    }


    handleSubmit(e) {
        e.preventDefault();

        console.log("c'est soumis")
        console.log(this.state)
    }
    render() {
        return (


            <div className="formCenter">

                <form onSubmit={this.handleSubmit} className="formFields" onSubmit={this.handleSubmit}>

                    <div className="formField">

                        <label className="formField__label" htmlFor="email">E-mail Address</label>
                        <input
                            type="email"
                            id="email"
                            className="formField__input"
                            placeholder="entre ton email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange} />

                    </div>

                    <div className="formField">

                        <label className="formField__label" htmlFor="name">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="formField__input"
                            placeholder="entre ton password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange} />


                    </div>

                    <div className="formField">

                        <button className="formField__button mr-20">Sign In</button>
                        <NavLink className="formField__link" to="/">Créer un compte  </NavLink>

                    </div>

                </form>

            </div>




        )
    }
}
