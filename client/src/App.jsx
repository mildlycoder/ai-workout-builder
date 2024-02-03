import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import FormField from './components/FormField';

const pageVariants = {
  initial: { opacity: 0, x: "100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "-100vw" },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const stepTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const pictures = [
  "/luffy1.webp",
  "/luffy2.webp",
  "/luffy3.webp",
  "/luffy4.webp",
  "/luffy1.webp",
  "/luffy2.webp",
  "/luffy3.webp",
  "/luffy4.webp",
];

function App() {
  const [workoutDetails, setWorkoutDetails] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    fitness_level: "",
    number_of_days: "",
    fitness_goal: ""
  });
  const [responseData, setResponseData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const [currentPicture, setCurrentPicture] = useState(pictures[0]);

  const totalSteps = 7; 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setWorkoutDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
      setCurrentPicture(pictures[currentStep]);
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    setCurrentPicture(pictures[currentStep - 2]);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return !!workoutDetails.age;
      case 2:
        return !!workoutDetails.weight;
      case 3:
        return !!workoutDetails.height;
      case 4:
        return !!workoutDetails.gender;
      case 5:
        return !!workoutDetails.fitness_level;
      case 6:
        return !!workoutDetails.number_of_days;
      case 7:
        return !!workoutDetails.fitness_goal;
      default:
        return true;
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formattedVariables = Object.entries(workoutDetails).map(([name, value]) => ({
        name,
        value,
      }));
      const response = await fetch('https://ai-workout-builder.onrender.com/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({variables: formattedVariables}),
      });

      if (response.ok) {
        console.log('Workout details submitted successfully!');
        const responseData = await response.json(); 
        setResponseData(responseData.responseText); 
      } else {
        console.error('Failed to submit workout details');
      }
    } catch (error) {
      console.error('Error occurred while submitting workout details:', error);
    } finally {
      setLoading(false)
    }
  };

  function formatResponseText(responseText) {
    const paragraphs = responseText.split('\n\n');
    return paragraphs.map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  }

  

  return (
    <motion.div
      className='bg-[#F28907] min-h-screen flex flex-col justify-center'
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={stepTransition}
        > 
         {loading && (
              <div className="text-[#084DA6] text-center mt-5">
                Loading...
              </div>
            )}

            {responseData && (
              <div className='flex flex-col items-center'>
                <h1 className='text-3xl text-[#084DA6] w-[75%] m-auto text-center mt-5'>
                  Thank you for submitting your workout details!
                </h1>
                <motion.div className="text-[#084DA6] text-left mt-5 w-[90%] md:w-[65%] mx-auto text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}>
                  {formatResponseText(responseData)}
                </motion.div>
              </div>
            )}

            {(currentStep === 1) && (
              <h1 className='text-3xl text-[#084DA6] w-[75%] m-auto text-center mt-5'>We are Strawhat crew we'll help you get your dream fitness, Now tell us about yourself</h1>
            )}
          <div className='flex justify-center p-10'>
            <motion.img src={currentPicture} className='w-[20%]' alt="" />
          </div>
         

         {
          !loading && ! responseData && (
            <motion.form
            onSubmit={handleSubmit}
            className='flex flex-col justify-center p-10'
            variants={pageVariants}
            transition={pageTransition}
          >
            {(currentStep === 1) && (
              <FormField
                label="tell us how old are you?"
                name="age"
                value={workoutDetails.age}
                onChange={handleChange}
              />
            )}
            {(currentStep === 2) && (
              <FormField
                label="What is your weight"
                name="weight"
                value={workoutDetails.weight}
                onChange={handleChange}
              />
            )}
            {(currentStep === 3) && (
              <FormField
                label="How tall are you"
                name="height"
                value={workoutDetails.height}
                onChange={handleChange}
              />
            )}
            {(currentStep === 4) && (
              <FormField
                label="What's your gender"
                name="gender"
                value={workoutDetails.gender}
                onChange={handleChange}
              />
            )}
            {(currentStep === 5) && (
              <FormField
                label="What is your current fitness level"
                name="fitness_level"
                value={workoutDetails.fitness_level}
                onChange={handleChange}
              />
            )}
            {(currentStep === 6) && (
              <FormField
                label="How many days can you workout"
                name="number_of_days"
                value={workoutDetails.number_of_days}
                onChange={handleChange}
              />
            )}
            {(currentStep === 7) && (
              <FormField
                label="Most importantly: What's your fitness dream/goal?"
                name="fitness_goal"
                value={workoutDetails.fitness_goal}
                onChange={handleChange}
              />
            )}

            <div className="flex w-[50%] m-auto justify-between">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.1 }}
                  className='bg-[#F2A172] p-3 border-[#BF0A19] border-2 m-5 px-4 py-2 rounded-md'
                >
                  Previous
                </motion.button>
              )}
              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.1 }}
                  className='bg-[#F2A172] p-3 border-[#BF0A19] border-2 m-5 px-4 py-2 rounded-md justify-self-end'
                >
                  Next
                </motion.button>
              ) : (
                <motion.button type="submit" whileHover={{ scale: 1.1 }}   className='bg-[#F2A172] p-3 border-[#BF0A19] border-2 m-5 px-4 py-2 rounded-md'>
                  Submit
                </motion.button>
              )}
            </div>
          </motion.form>
          )
         }
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
