import React from 'react'
import faker from 'faker'
import ReactDom from 'react-dom'
import superagent from 'superagent'

const API_URL = 'https://pokeapi.co/api/v2'

class PokemonForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pokeName: ''
        }

        this.handlePokeNameChange = this.handlePokeNameChange.bind(this)
    }

    handlePokeNameChange(e){
        this.setState({pokeName: e.target.value})
    }

    render(){
        return (
            //ALL INPUTS SHOULD HAVE THEIR VALUES BOUND TO A STATE, THIS IS CALLED CONTROLLED INPUTS
            <form>
                <input
                  type='text'
                  name='pokemonName'
                  placeholder='poke name'
                  value={this.state.pokeName}
                  onChange={this.handlePokeNameChange}
                />
                <p> name: </p>
                <p> {this.state.pokeName} </p>
            </form>
        )
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pokemon: [],
        }
    }
    //this will get called once right before the app component gets added to the dom, mount means to add it to the DOM.
    componentWillMount(){
        console.log('hell, low whirled')
        superagent.get(`${API_URL}/pokemon/`)
        .then(res => {
            console.log('res.body.results', res.body.results)
        })
        .catch(console.error)
    }

    render(){
        return (
            <div>
              <h1> form demo </h1>  
              <PokemonForm />
            </div>
        )
    }
}

const container = document.createElement('div')
document.body.appendChild(container)
ReactDom.render(<App />, container)