import React from 'react'
import Navigation from './components/Navigation/Navigation.tsx'
import Logo from './components/Logo/Logo.tsx'
import Rank from './components/Rank/Rank.tsx'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.tsx'
import SignIn from './components/SignIn/SignIn.tsx'
import Register from './components/Register/Register.tsx'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.tsx'
import './App.css'
import 'tachyons'

export interface FaceDetectProps {
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onPictureSubmit?: () => void
    onRouteChange?: (route: string) => void
}

interface FaceDetectState {
    input: string,
    imageUrl: string,
    box: {
        leftCol: number,
        topRow: number,
        rightCol: number,
        bottomRow: number
    }
    route: string
    isSignedIn: boolean
    user: {
        id: string,
        name: string
        password: string
        email: string,
        entries: number,
        joined: Date
    }
}

export interface UserData {
    id: string,
    name: string
    password: string
    email: string,
    entries: number,
    joined: Date
}

interface ClarifaiReturn {
    method: string,
    headers: {
        Accept: string,
        Authorization: string
    }
    body: string
}

interface ClarifaiFetch {
    outputs: [{
        data: {
            regions: [{
                region_info: {
                    bounding_box: {
                        bottom_row: number,
                        left_col: number,
                        right_col: number
                        top_row: number
                    }
                }
            }]
        }
    }]
}

const returnClarifaiRequestOptions = (imageUrl: string): ClarifaiReturn => {
    const PAT = '0c09f15969a642a6a9526f22b1af1570'
    const USER_ID = 'tyseawood'
    const APP_ID = 'smartbrain'

    const raw = JSON.stringify({
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        inputs: [
            {
                data: {
                    image: {
                        url: imageUrl,
                    },
                },
            },
        ],
    })

    return {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Key ' + PAT,
        },
        body: raw,
    }
}

class App extends React.Component<FaceDetectProps, FaceDetectState> {
    constructor(props: FaceDetectProps) {
        super(props)
        this.state = {
            input: '',
            imageUrl: '',
            box: {
                leftCol: 0,
                topRow: 0,
                rightCol: 0,
                bottomRow: 0
            },
            route: 'sign-in',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                password: '',
                email: '',
                entries: 0,
                joined: new Date()

            }
        }
    }

    loadUser = (user: UserData) => {
        this.setState({
            user: {
                id: user.id,
                name: user.name,
                password: user.password,
                email: user.email,
                entries: user.entries,
                joined: user.joined
            }
        })
    }


    calculateFaceLocation = (data: ClarifaiFetch) => {
        const clarifaiFace =
            data.outputs[0].data.regions[0].region_info.bounding_box
        const image = document.getElementById('input-image') as HTMLImageElement
        const width = Number(image.width)
        const height = Number(image.height)
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - clarifaiFace.right_col * width,
            bottomRow: height - clarifaiFace.bottom_row * height
        }
    }
    displayFaceBox = (box: {
        leftCol: number,
        topRow: number,
        bottomRow: number,
        rightCol: number
    }) => {
        this.setState({box})
    }

    fetchApi = async (): Promise<ClarifaiFetch> => {
        const apiCall = await fetch('https://api.clarifai.com/v2/models/' + 'face-detection' + '/outputs', returnClarifaiRequestOptions(this.state.input))
        return await apiCall.json() as Promise<ClarifaiFetch>
    }
    onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({input: event.target.value})
    }

    onPictureSubmit = (): void => {
        this.setState({imageUrl: this.state.input})
        this.fetchApi().then(result => {
            if (result) {
                fetch('http://localhost:4000/image', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                }).then(result => result.json())
                    .then(count => {
                        // @ts-ignore
                        return this.setState(Object.assign(this.state.user, {entries: count}))
                    })
                this.displayFaceBox(this.calculateFaceLocation(result))
                this.setState({input: ''})
            }
        })
    }

    onRouteChange = (route: string) => {
        if (route === 'sign-out') {
            this.setState({isSignedIn: false})
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route})
    }

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state
        return (
            <>
                <div className={'App'}>

                    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                    {route === 'home'
                        ? <div>
                            <Logo/>
                            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                            <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
                            <FaceRecognition box={box} imageUrl={imageUrl}/>
                        </div>
                        : (
                            route === 'sign-in'
                                ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                        )
                    }
                </div>
            </>
        )
    }
}

export default App


// .then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))