import { Footer } from "../../commons/Footer";
import ContestList from "./../../../components/Contest/ContestList"

export const PageLayout = (props) => {
    const { children } = props;

    return <div className="flex flex-grow flex-column bg-backcolor">
        <div className="w-72 lg:mr-2 hidden lg:inline">
            <ContestList />
        </div>
        <div className="flex-1 lg:ml-2">
            {children}
        </div>
    </div>
}