import * as React from "react";
import SlideHeader from "./Headers/SlideHeader";
import SlideSevereHeader from "./Headers/SlideSevereHeader";
import SlideSevereHeaderMsg from "./Headers/SlideSevereHeadMsg";
import { AudioPlayerProvider } from "react-use-audio-player";
import { VocalMale, VocalFemale } from "../../../components/VocalAudio";
import VocalAudio from "../../../components/VocalAudio";

import { Slides } from "../../../hooks/useSlides";
import CityIntro from "./Slides/CityIntro";
import CityInfo from "./Slides/CityInfo";

enum ActionType {
    INCREASE = "INCREASE",
    DECREASE = "DECREASE",
    SET = "SET"
}

interface Action {
    type: ActionType
    payload: number
}

interface State {
    index: number
}

const SlideshowReducer = (state: State, action: Action) => {
    const { type, payload } = action;
    switch (type) {
        case ActionType.INCREASE:
            return { index: state.index + payload };
        case ActionType.DECREASE:
            return { index: state.index - payload };
        case ActionType.SET:
            return { index: payload };
        default:
            return state;
    }
};

interface SlidesContainerProps {
    setMainVol: React.Dispatch<React.SetStateAction<number>>
}

const SlidesContainer = ({ setMainVol }: SlidesContainerProps) => {    
    const [slideState, slideDispatch] = React.useReducer(SlideshowReducer, { index: 0 });
    const [vocal, setVocal] = React.useState<VocalMale | VocalFemale>(VocalFemale.CURRENT_COND);

    const currentSlide = React.useMemo(() => {
        console.log("Rendering new slide");
        switch (slideState.index) {
            case Slides.INTRO:
                return <CityIntro />;
            case Slides.INFO:
                return <CityInfo />;
            default:
                return null;
        }
    }, [slideState.index]);

    // Test transition
    React.useEffect(() => {
        let timeout = setTimeout(() => {
            slideDispatch({ type: ActionType.INCREASE, payload: 1 });
        }, 15000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div id="info-slides-container" className="flex flex-col absolute right-infoslides-container-r top-infoslides-container-t w-infoslides-container h-infoslides-container max-h-infoslides-container z-[1] p-slides">
            <SlideHeader />
            <SlideSevereHeader />
            <SlideSevereHeaderMsg />
            <div id="info-slide-container" className="absolute top-infoslide-container-t h-infoslide-container w-infoslide-container">
                <AudioPlayerProvider>
                    <VocalAudio vocal={vocal} setMainVol={setMainVol} />
                </AudioPlayerProvider>
                {currentSlide}
            </div>
        </div>
    );
};

export default SlidesContainer;
