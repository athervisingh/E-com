import React, { useState } from 'react'
import maps from "../../assets/maps.gif"
import { useEffect } from 'react'
import { FiCopy, FiMenu, FiX } from 'react-icons/fi'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { FiCopy } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setBandValues, setModelThresHoldObject, setModelThresHoldValue } from '../../redux/Slices/additional-details/additional-details.slice'
const Slider = ({ handleModelChange, geoJsonData }) => {
    const dispatch = useDispatch();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [settingsSelected, setSettingsSelected] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const handleBandChange = (e, bandKey) => {
        // setBandValues((prev) => ({
        //     ...prev,
        //     [bandKey]: e.target.value,
        // }));
        dispatch(setBandValues({ bandkey: bandKey, value: e.target.value }));
    };
    const {ThresholdClass, modelSelection, modelThresHold } = useSelector((state) => state.addDetailsSlice);
    const [accumulatedData, setAccumulatedData] = useState([]);
    const handleCopy = () => {
        const dataToCopy = JSON.stringify(accumulatedData, null, 2);
        navigator.clipboard.writeText(dataToCopy)
            .then(() => {
                toast.info('Data copied to clipboard!', {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            })
            .catch(err => {
                console.error("Failed to copy:", err);
            });
    };
    useEffect(() => {
        if (geoJsonData && Object.keys(geoJsonData).length > 0) {
            setAccumulatedData(prevData => [...prevData, geoJsonData]);
        }
    }, [geoJsonData]);
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
            />

            <div onClick={() => setSliderOpen(true)} className={`${sliderOpen ? 'd-none' : 'd-block'} position-absolute bg-white border rounded p-2 cursor-pointer`} style={{ zIndex: "1000", top: "15px", right: "20px" }} >
                {/* <img src={menuImage} alt="..." width={20} /> */}
                <FiMenu className="w-6 h-6" />
            </div>

            <div className={`${sliderOpen ? "w-[40%] max-[1224px]:w-[60%] max-[812px]:w-[70%] max-[700px]:w-[100%]" : "w-0"} z-[1001] d-flex flex-column align-items-center sidebar position-absolute right-0 rounded-xl`} style={{ overflowY: "scroll", height: '100vh', overflowX: "hidden" }}>

                <div className="w-100 d-flex justify-between">
                    <div className={`${settingsSelected ? "bg-primary cursor-pointer  text-white" : "bg-light cursor-pointer text-black"} fw-bold text-lg w-[50%] p-3 text-center d-flex justify-content-center gap-3 align-items-center`} onClick={() => setSettingsSelected(true)}>
                        <img src={maps} alt="..." className="w-8 rounded-full" />Advanced Settings
                    </div>

                    <div className={`${!settingsSelected ? "bg-primary text-white  cursor-pointer" : "bg-light cursor-pointer text-black"} fw-bold text-lg w-[50%] p-3 text-center d-flex justify-content-center gap-3 align-items-center`} onClick={() => setSettingsSelected(false)}>
                        <img src={maps} alt="..." className="w-8 rounded-full" />Geo Json
                    </div>

                      <button onClick={() => setSliderOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2">
                        <FiX className="w-6 h-6" />
                      </button>

                </div>
                <div className={`${!sliderOpen ? "d-none" : "d-flex"} flex-column w-100 `}>
                    {settingsSelected && <>
                        <div className="rounded-lg">
                            <h1 className="text-xl pt-4 pl-5 cursor-pointer" data-tour="band-settings">Bands</h1>
                            <div className="">
                                <div className="p-2 bg-white m-3 w-100">
                                    <select
                                        className="form-select cursor-pointer"
                                        aria-label="B options"
                                        style={{ maxHeight: "150px", overflowY: "auto", width: "90%" }}
                                        onChange={(e) => handleBandChange(e, "band1")}
                                    >
                                        <option value="-1">Band 1</option>
                                        {[...Array(12)].map((_, index) => (
                                            <option key={index} value={`B${index + 1}`}>
                                                B{index + 1}
                                            </option>
                                        ))}
                                        <option value="B8A">B8A</option>
                                    </select>
                                </div>
                                <div className="p-2 bg-white m-3 w-100">
                                    <select
                                        className="form-select cursor-pointer"
                                        aria-label="B options"
                                        style={{ maxHeight: "150px", overflowY: "auto", width: "90%" }}
                                        onChange={(e) => handleBandChange(e, "band2")}
                                    >
                                        <option value="-1">Band 2</option>
                                        {[...Array(12)].map((_, index) => (
                                            <option key={index} value={`B${index + 1}`}>
                                                B{index + 1}
                                            </option>
                                        ))}
                                        <option value="B8A">B8A</option>
                                    </select>
                                </div>
                                <div className="p-2 bg-white m-3 w-100">
                                    <select
                                        className="form-select cursor-pointer"
                                        aria-label="B options"
                                        style={{ maxHeight: "150px", overflowY: "auto", width: "90%" }}
                                        onChange={(e) => handleBandChange(e, "band3")}
                                    >
                                        <option value="-1">Band 3</option>
                                        {[...Array(12)].map((_, index) => (
                                            <option key={index} value={`B${index + 1}`}>
                                                B{index + 1}
                                            </option>
                                        ))}
                                        <option value="B8A">B8A</option>
                                    </select>
                                </div>

                            </div>

                        </div>

                        <div className="rounded-lg">
                            <h1 className="text-xl pt-4 pl-5">Select Date</h1>
                            <div className="p-2 bg-white m-3">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                    placeholderText="YYYY-MM-DD"
                                />
                            </div>
                        </div>


                        <div className="rounded-lg">
                            <h1 className="text-xl pt-4 pl-5">Model</h1>
                            <div className="p-2 bg-white m-3">
                                <select
                                    className="form-select w-100 cursor-pointer"
                                    aria-label="B options"
                                    style={{ maxHeight: "150px", overflowY: "auto" }}
                                    defaultValue={modelSelection}
                                    onChange={handleModelChange}
                                >
                                    <option value="-1">Model CLassifier</option>

                                    <option value="Random Forest Classifier">
                                        Random Forest Classifier
                                    </option>
                                    <option value="Parallelepiped Classifier">
                                        Parallelepiped Classifier
                                    </option>
                                    <option value="Maximum Likelyhood Classifier">
                                        Maximum Likelyhood Classifier
                                    </option>
                                    <option value="Mahalanobis Distance Classifier">
                                        Mahalanobis Distance Classifier
                                    </option>
                                </select>
                            </div>
                        </div>
                        {modelSelection === "Maximum Likelyhood Classifier" && (
                            <div className="rounded-lg">
                                <h1 className="text-xl pt-4 pl-5">Threshold</h1>
                                <div className="p-2 bg-white m-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter threshold value"
                                        // value={modelThresHold === null || typeof modelThresHold!=='number' ? 1 : modelThresHold}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (e.target.value.length === 0) {
                                                dispatch(setModelThresHoldValue({ value: "1" }));
                                            }
                                            if (isNaN(value)) {
                                                toast.error('Please enter a numeric value', {
                                                    position: "top-left",
                                                    autoClose: 3000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: "colored",
                                                    transition: Bounce,
                                                });
                                            } else {
                                                // setModelThresHold(() => {
                                                //     return (
                                                //         value
                                                //     );
                                                // });
                                                dispatch(setModelThresHoldValue({ value: value }));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {modelSelection === "Mahalanobis Distance Classifier" &&
                            [...new Set(ThresholdClass)].map((name, index) => {
                                // Looping through the unique names only once
                                return (
                                    <div key={index} className="rounded-lg mb-5">
                                        <h1 className="text-xl pt-4 pl-5">Threshold for {name}</h1>
                                        <div className="p-2 bg-white m-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Enter threshold for ${name}`}
                                                value={modelThresHold[name] || ""} // Ensure no undefined value
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (isNaN(value)) {
                                                        toast.error('Please enter a numeric value', {
                                                            position: "top-left",
                                                            autoClose: 3000,
                                                            hideProgressBar: false,
                                                            closeOnClick: true,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                            theme: "colored",
                                                            transition: Bounce,
                                                        });
                                                    } else {
                                                        // setModelThresHold((prev) => ({
                                                        //     ...prev,
                                                        //     [name]: value,
                                                        // }));
                                                        dispatch(setModelThresHoldObject({ name: name, value: value }));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        }

                    </>}

                    {!settingsSelected && (
                        <div className="p-4 bg-gray-50 border rounded-lg shadow-lg">
                            <div className="flex justify-end">
                                <FiCopy
                                    onClick={handleCopy}
                                    className="text-xl text-blue-500 cursor-pointer hover:text-blue-600"
                                    title="Copy Data"
                                />
                            </div>
                            {accumulatedData.length > 0 ? (
                                <pre className="text-md flex justify-center text-gray-800 p-4 mt-2 rounded-lg bg-gray-100 overflow-auto">
                                    <code className="whitespace-pre-wrap">{JSON.stringify(accumulatedData, null, 2)}</code>
                                </pre>
                            ) : (
                                <div className="text-gray-500 text-center">No data available</div>
                            )}
                        </div>
                    )}


                </div>
            </div>
        </>
    )
}

export default Slider
