import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Switch } from "@mui/material"
<<<<<<< HEAD
=======
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
>>>>>>> a97301219e1c288d37a16baa659dd1fff5610691
// import { format } from "date-fns"
import "../assets/css/create-experiment.css"

export default function CreateExperimentModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState()
  const [experimentType, setExperimentType] = useState("quiz")
  const [accessType, setAccessType] = useState("public")
  const [multipleAttempts, setMultipleAttempts] = useState(false)
  const [instructions, setInstructions] = useState("")
<<<<<<< HEAD
=======
  // const [value, setValue] = React.useState(dayjs('2022-04-17'));

>>>>>>> a97301219e1c288d37a16baa659dd1fff5610691
console.log("It is loaded");
  const handleSubmit = () => {
    if (title && experimentType && accessType) {
      onSubmit?.({
        title,
        deadline,
        experimentType,
        accessType,
        multipleAttempts,
        instructions,
      })
      onClose()
    }
  }

  const resetForm = () => {
    setTitle("")
    setDeadline(undefined)
    setExperimentType("quiz")
    setAccessType("public")
    setMultipleAttempts(false)
    setInstructions("")
  }

//   if (!isOpen) return null

  return (
    <div className="modal-overlay">
        {/* <div className="square">HELLO</div> */}
      <div className="modal">
        <h2 className="modal-title">Create New Experiment</h2>
        <p className="modal-subtitle">Set up a new experiment for your students</p>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Experiment Title</label>
            <input
              id="title"
              placeholder="e.g., Acid-Base Titration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <div className="date-picker">
<<<<<<< HEAD
              <button
                onClick={() => {
                  const today = new Date()
                  setDeadline(today)
                }}
              >
                <CalendarIcon size={16} />
                {deadline ? format(deadline, "PPP") : "Select a date"}
              </button>
=======
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                className="date-picker"
                  // label="Controlled picker"
                //value={value}
                
                sx={{width: 500, backgroundColor: '#1f2937', borderRadius: '10px', color: 'white', border: '1px solid #838383'}}
                  onChange={(newValue) => setValue(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
>>>>>>> a97301219e1c288d37a16baa659dd1fff5610691
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="experimentType">Experiment Type</label>
            <select
              id="experimentType"
              value={experimentType}
              onChange={(e) => setExperimentType(e.target.value)}
            >
              <option value="quiz">Quiz</option>
              <option value="molecular-builder">Molecular Builder</option>
              <option value="element-connection">Element Connection</option>
              <option value="balancing-equations">Balancing Equations</option>
              <option value="virtual-lab">Virtual Lab</option>
            </select>
          </div>

          <div className="form-group">
            <label>Access Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="accessType"
                  value="public"
                  checked={accessType === "public"}
                  onChange={() => setAccessType("public")}
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  name="accessType"
                  value="invite"
                  checked={accessType === "invite"}
                  onChange={() => setAccessType("invite")}
                />
                Invite Only
              </label>
            </div>
          </div>

          <div className="form-group switch-group">
            <label htmlFor="multipleAttempts">Allow Multiple Attempts
                <p>Students can retry the experiment multiple times</p>
            </label>
          <Switch
            id="attempt-switch"
            checked={multipleAttempts}
            onChange={() => setMultipleAttempts(!multipleAttempts)}
            color="secondary"
                sx={{
                    width: 45,
                    height: 25,
                    padding: 0,
                        "& .MuiSwitch-switchBase": {
                                paddingTop: 0.4,
                                color: "black",
                                transform: "translateX(-8px)",
                            "&.Mui-checked": {
                                transform: "translateX(15px)",
                                color: "black",
                                "& + .MuiSwitch-track": {
                                    backgroundColor: "#8e4cff",
                                    opacity: 1,
                                },
                            },
                        },
                                "& .MuiSwitch-thumb": {
                                    width: 20,
                                    height: 20,
                                    boxShadow: "none",
                                },
                                    "& .MuiSwitch-track": {
                                        borderRadius: 24 / 2,
                                        backgroundColor: "#27272a",
                                        opacity: 1,
                                    },
                    }}
                />
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Custom Instructions (Optional)</label>
            <textarea
              id="instructions"
              placeholder="Enter any specific instructions for this experiment..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-outline" onClick={() => { onClose(); resetForm(); }}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Save Settings</button>
        </div>
      </div>
    </div>
  )
}
