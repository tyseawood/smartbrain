import React from "react";

type NavProp = {
    onRouteChange: (e: string) => void
    isSignedIn: boolean
}
const Navigation: React.FC<NavProp> = ({onRouteChange, isSignedIn}) => {
    if (isSignedIn) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p
                    onClick={() => onRouteChange('sign-out')}
                    className={'f3 link dim black underline pa3 pointer'}>
                    Sign Out
                </p>
            </nav>
        )
    } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p
                    onClick={() => onRouteChange('sign-in')}
                    className={'f3 link dim black underline pa3 pointer'}>
                    Sign In
                </p>
                <p onClick={() => onRouteChange('register')}
                   className={'f3 link dim black underline pa3 pointer'}>
                    Register
                </p>
            </nav>
        )

    }
}
export default Navigation
