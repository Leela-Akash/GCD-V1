import React from 'react';
import Stepper, { Step } from '../effects/Stepper';

const ProjectWorkflowStepper = () => {
  const steps = [
    {
      title: "Citizen Login or Registration",
      description: "Users authenticate securely using Google Sign-In to access the platform."
    },
    {
      title: "Raise a Complaint",
      description: "Citizens initiate the complaint process through an intuitive interface."
    },
    {
      title: "Choose Domain",
      description: "Select the appropriate category for the complaint (e.g., infrastructure, sanitation, utilities)."
    },
    {
      title: "Upload Voice Recording",
      description: "Record or upload a voice message describing the problem in detail."
    },
    {
      title: "Upload Pics and Videos",
      description: "Attach supporting multimedia evidence to strengthen the complaint."
    },
    {
      title: "Submit Complaint",
      description: "Final review and submission of the complete complaint package."
    },
    {
      title: "Stores in Firebase",
      description: "Complaint data is securely stored in Firebase database with real-time sync."
    },
    {
      title: "Google APIs Give Priority",
      description: "AI analyzes content and assigns priority scores using Google Cloud services."
    },
    {
      title: "Admins View and Respond",
      description: "Municipal administrators review prioritized complaints and provide timely responses."
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <Stepper
        initialStep={1}
        stepCircleContainerClassName="workflow-stepper"
        stepContainerClassName="workflow-steps"
        contentClassName="workflow-content"
        footerClassName="workflow-footer"
        backButtonText="Previous"
        nextButtonText="Next"
        disableStepIndicators={false}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <div style={{
              padding: '20px',
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '15px',
                background: 'linear-gradient(135deg, #4285F4, #AF99F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Step {index + 1}: {step.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#ddd',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                {step.description}
              </p>
            </div>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default ProjectWorkflowStepper;
