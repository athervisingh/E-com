
import { useEffect, useState, useCallback, useRef } from "react";

import { MapContainer, TileLayer, LayersControl, ImageOverlay, } from "react-leaflet";
import Joyride from "react-joyride";
import DrawControl from "./components/DrawControl";
import "leaflet/dist/leaflet.css";
import SearchComponent from "./components/SearchComponent";
import ScaleControl from "./components/ScaleControl";
import axios from "axios";
import "./App.css";
import Loading from "./components/Loading";
import Slider from "./components/Slider";
import UtilityButtons from "./components/UtilityButtons";
import DropDowns from "./components/Dropdowns";
import ImageOverlays from "./components/ImageOverlays";
import { stepTour } from "./components/TourStep";
import OpacitySlider from "./components/OpacitySlider";
import { useDispatch, useSelector } from "react-redux";
import { changeButton } from "./redux/Slices/ButtonSlice/buttonSlice";
import { setDropdownData, setGeoJsonData, setRegionOverlays, setClassOverlays, setClassOverlaysOpacity, setROIdata, setclassdata } from "./redux/Slices/DataSlice/dataSlice";
import { setModelSelection, setModelThresHoldValue, setThresholdClass } from "./redux/Slices/AdditionalDetailsSlice/addDetailsSlice";

const scale = {
  4: 1000,
  5: 500,
  6: 300,
  7: 100,
  8: 50,
  9: 30,
  10: 20,
  11: 10,
  12: 5,
  13: 2,
  14: 1,
  15: 0.5,
  16: 0.3,
  17: 0.1,
  18: 0.05
};

const App = () => {
  const scaleMap = new Map(Object.entries(scale));
  const dispatch = useDispatch();


  const [showMask, setShowMask] = useState(false);


  const { ROIdata, classdata, dropdownData, geoJsonData, regionOverlays, classOverlays } = useSelector((state) => state.dataSlice);

  const { enableClasses, enableROI, drawControl, showImageButton } = useSelector((state) => state.buttonSlice);

  const { bandValues, ThresholdClass, modelSelection, modelThresHold } = useSelector((state) => state.addDetailsSlice);

  const [loading, setLoading] = useState(false);

  //layers
  const [opacitySlider, setOpacitySlider] = useState(false);
  const [allLayers, setAllLayers] = useState([]);

  //beacon
  const [beacon, setBeacon] = useState(() => {
    const storedData = localStorage.getItem('tour');
    return storedData ? false : true;
  });
  const map = useRef(null);
  const steps = stepTour(beacon);

  const handleSliderChange = (name, value, overlayIndex) => () => {
    dispatch(setClassOverlaysOpacity({ name: name, value: value, overlayIndex: overlayIndex }));
  };

  const handleModelChange = (e) => {
    dispatch(setModelSelection({ value: e.target.value }));
    if (modelSelection === "Mahalanobis Distance Classifier") {
      const newThresholds = {};

      ThresholdClass.forEach(className => {
        newThresholds[className] = '5';
      });

      dispatch(setModelThresHoldValue({ value: newThresholds }));
    } else if (modelSelection === "Maximum Likelyhood Classifier") {
      dispatch(setModelThresHoldValue({ value: "1" }));
    }
  };

  //Redux Done
  const handleDropdownChange = (e, index) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const value = selectedOption.value;
    const name = selectedOption.getAttribute('name');

    dispatch(setDropdownData({ value: value, name: name, index: index }));

    if (value === "-1") {
      dispatch(changeButton({ type: 'enableClasses', payload: false }));
    } else {
      dispatch(changeButton({ type: 'drawControl', payload: true }));
    }
  };

  //Redux Done
  const getROIdata = (name = "") => {
    const storedData = JSON.parse(localStorage.getItem('roi_data'));
    if (storedData) {
      const newData = Object.keys(storedData).map((ele) => ({
        name: ele,
        value: storedData[ele] || "",
      }));

      dispatch(setROIdata({ payload: newData }));

      if (name.length) {
        const selectedValue = storedData[name];

        dispatch(setDropdownData({ value: selectedValue, name: name, index: 0 }));

        if (selectedValue === "-1") {
          dispatch(changeButton({ type: 'enableClasses', payload: false }));
        } else {
          dispatch(changeButton({ type: 'drawControl', payload: true }));
        }
      }
    }
  };

  //Redux Done
  const getclassdata = (name = "") => {
    const storedData = JSON.parse(localStorage.getItem('class_data'));
    if (storedData) {
      const newData = Object.keys(storedData).map((ele) => ({
        name: ele,
        value: storedData[ele] || "",
      }));

      dispatch(setclassdata({ payload: newData }));

      if (name.length) {
        const selectedValue = storedData[name];

        dispatch(setDropdownData({ value: selectedValue, name: name, index: 1 }));

        if (name === "-1") {
          dispatch(changeButton({ type: 'drawControl', payload: false }));
        } else {
          dispatch(changeButton({ type: 'drawControl', payload: true }));
        }
      }
    }
  };


  useEffect(() => { getROIdata(); getclassdata(); }, []);

  //Redux Done
  const generateImageFromPixels = (imageURLFromBackend) => {
    const arr = structuredClone(regionOverlays);
    const lastRegion = arr[arr.length - 1];
    lastRegion.imageUrl = imageURLFromBackend;

    dispatch(setRegionOverlays({ payload: arr }));
    dispatch(setGeoJsonData({ payload: [] }));
  };

  //Redux Done
  const generateMaskFromPixels = (data) => {
    let images = {};
    const lastRegion = structuredClone(regionOverlays[regionOverlays.length - 1]);

    Object.keys(data).forEach(key => {
      const [base64Image, opacity, area] = data[key];
      images[key] = {
        url: `data:image/png;base64,${base64Image}`,
        opacity: opacity,
        area: area,
        bounds: lastRegion.imageBounds
      };
    });

    dispatch(setClassOverlays({ payload: images }));
  };

  //Redux Done
  const handleSelectionClick = (bounds) => {
    const arr = [...regionOverlays];

    const obj = {
      "imageUrl": null,
      "imageBounds": bounds,
    }

    arr.push(obj);

    dispatch(setRegionOverlays({ payload: arr }));
  };

  const handleImageShow = () => { setShowImage((prev) => !prev); };
  const getLayers = (elem) => { setAllLayers(prevData => [...prevData, elem]); }

  //Redux Done
  const sendGeoJsonData = async () => {
    try {
      setLoading(true);

      const combinedData = {
        "geojson": geoJsonData,
        "bands": bandValues,
        "height": scaleMap.get(map.current.getZoom() + ""),
      };

      const response = await axios.post(
        "https://khaleeque.in/get_gee_image",
        combinedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
          timeout: 300000,
        }
      );

      const pixelData = await response.data;

      const imageURLFromBackend = URL.createObjectURL(pixelData);

      generateImageFromPixels(imageURLFromBackend);
      dispatch(changeButton({ type: 'enableClasses', payload: true }));
      dispatch(changeButton({ type: 'showImageButton', payload: false }));

      if (allLayers.length) {
        allLayers.forEach((ele) => {
          ele[0].removeLayer(ele[1]);
        });
        setAllLayers([]);
        dispatch(changeButton({ type: 'showImageButton', payload: false }));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const blobError = error.response.data;
        const errorMsg = await blobError.text();
        alert(`Error : ${errorMsg}`);
      } else {
        alert(error);
      }
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const sendMaskData = async () => {
    const combinedData = {
      "geojson": geoJsonData,
      "model": modelSelection,
      "thresholds": modelThresHold,
      "height": scaleMap.get(map.current.getZoom() + "")
    };

    try {
      setLoading(true);
      setShowMask(true);

      const response = await axios.post("https://khaleeque.in/get_mask", combinedData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
        timeout: 300000,
      });

      const blob = response.data;
      const reader = new FileReader();

      reader.onloadend = async () => {
        const jsonData = reader.result;
        const maskData = await JSON.parse(jsonData);
        generateMaskFromPixels(maskData);
      }

      reader.readAsText(blob);

      if (allLayers.length) {
        allLayers.map((ele) => {
          ele[0].removeLayer(ele[1]);
        });

        setAllLayers([]);
      }

      dispatch(changeButton({ type: "enableClasses", payload: false }));
      dispatch(changeButton({ type: "enableROI", payload: true }));
      dispatch(changeButton({ type: "showImageButton", payload: true }));
      dispatch(changeButton({ type: "drawControl", payload: false }));
      dispatch(changeButton({ type: "imageButtonDisabled", payload: true }));


      dispatch(setDropdownData({ value: null, name: null, index: 0 }));
      dispatch(setDropdownData({ value: null, name: null, index: 1 }));


    } catch (error) {
      if (error.response && error.response.status === 400) {
        const blobError = error.response.data;
        const errorMsg = await blobError.text();
        alert(`Error : ${errorMsg}`);
      } else {
        alert('An unknown error occurred.');
      }
      window.location.reload();
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dropdownData[1].selection && dropdownData[1].name !== "-1") {
      dispatch(setThresholdClass({ name: dropdownData[1].name }));
    }
  }, [dropdownData[1].selection]);

  useEffect(() => {
    if (modelSelection === "Mahalanobis Distance Classifier") {
      const newThresholds = {};

      ThresholdClass.forEach(className => {
        newThresholds[className] = '5';
      });

      dispatch(setModelThresHoldValue({ value: newThresholds }));
    } else if (modelSelection === "Maximum Likelyhood Classifier") {
      dispatch(setModelThresHoldValue({value : "1"}));
    }

  }, [modelSelection, ThresholdClass]);
  
  return (
    <div className="relative" style={{ zIndex: "10" }}>
      <div className="absolute z-[1000] bottom-7" onClick={() => localStorage.setItem("tour", "true")}>
        <Joyride
          steps={steps}
          run={true}
          continuous
          showSkipButton
          showProgress
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      </div>
      <div className="z-[1000] absolute right-4 w-20 h-20" data-tour="Humburger"></div>
      {loading ? (<Loading />) : null}

      {/* HAMBURGER SLIDER */}
      <Slider handleModelChange={handleModelChange} geoJsonData={geoJsonData} />

      {/* Image Segment Reload */}
      <UtilityButtons showImageButton={showImageButton} sendGeoJsonData={sendGeoJsonData} sendMaskData={sendMaskData} />

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={4}
        dragging={true}
        style={{ height: "100vh", width: "100%", zIndex: "1" }}
        doubleClickZoom={false}
        ref={map}
        minZoom={4}
      >
        <LayersControl data-tour="satellite-btn" position="bottomright">
          <LayersControl.BaseLayer name="Simple Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="Satellite Map">
            <TileLayer
              url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=fIYt5qeKuBJ66khalaCH"
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <div className="absolute my-[0.72rem] mx-[1.2rem] d-flex gap-11 flex-wrap z-[1000] left-8 md:left-12 max-[1077px]:gap-3 ">
          <div className="" data-tour="search-bar"><SearchComponent /></div>

          {/* ROI Dropdown */}
          <DropDowns dataTour={"roi-dropdown"} enable={enableROI} handleChange={handleDropdownChange} heading={"Region of Interest"} data={ROIdata} modal={"#exampleModal"} getData={getROIdata} index={0} />

          {/* Classes Dropdown */}
          <DropDowns dataTour={"class-dropdown"} enable={enableClasses} handleChange={handleDropdownChange} heading={"Classes"} data={classdata} modal={"#classModel"} getData={getclassdata} index={1} />

          <div className={showMask ? `z-[500] cursor-pointer md:w-[178px] w-[150px] bg-white md:h-9 h-8 text-center font-bold text-xs border border-black ${opacitySlider ? "rounded-t-[5px]" : "rounded-[5px]"}` : 'hidden'}>

            <button className={`w-full h-full `} onClick={() => setOpacitySlider(!opacitySlider)}>{opacitySlider ? 'Hide Opacity' : 'Show Opacity'}</button>

            {opacitySlider && 
              <div className="max-h-[50vh] md:max-h-[80vh] overflow-auto bg-white opacity-div rounded-b-[10px] ">
                {classOverlays.map((ele, index) => (
                    <OpacitySlider key={index}  overlayIndex={index} opacitySlider={opacitySlider} imageData={ele} handleSliderChange={handleSliderChange} /> 
                ))}
              </div>
            }       
            
          </div>
        </div>

        {classOverlays?.map((ele, index) => (
          <ImageOverlays key={index} imageData={ele} />
        ))}

        {regionOverlays?.map((ele, index) => {
          if (ele.imageUrl) return <ImageOverlay
            key={index}
            url={ele.imageUrl}
            bounds={ele.imageBounds}
            eventHandlers={{ click: handleImageShow }}
          />
        })}

        {drawControl ? (
          <DrawControl
            onSelectionClick={handleSelectionClick}
            getLayers={getLayers}
          />
        ) : null}
        <div className="p-10 absolute bottom-9 right-8" data-tour="scale-component">
          <ScaleControl />
        </div>

      </MapContainer>
    </div >
  );
};




export default App;