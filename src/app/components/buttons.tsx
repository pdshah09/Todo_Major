export default function LogButton( {text} : { text : string} ){
    return(
        <button
                                type="submit"
                                className="w-full bg-canvas hover:bg-dashboard text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {text}
        </button>
    );
}