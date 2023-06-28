import { Component } from 'react'
import Navigation from './components/Navigation/Navigation.tsx'
import Logo from './components/Logo/Logo.tsx'
import Rank from './components/Rank/Rank.tsx'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.tsx'
import './App.css'
import 'tachyons'

class App extends Component {
	render() {
		return (
			<>
				<div className={'App'}>
					<Navigation />
					<Logo />
					<Rank />
					<ImageLinkForm />
					{/*<FaceRecognition />*/}
				</div>
			</>
		)
	}
}

export default App
