import axios from 'axios';
import { useState } from 'react';
import * as XLSX from "xlsx"

function App() {

 const [msg,setmsg] = useState("")
 const [status,setstatus] = useState(false)
 const [emailList,setEmailList] = useState([])


 function handlemsg(evt)
 {
  setmsg(evt.target.value)
 }

 function handlefile(event)
 {
     const file = event.target.files[0];
    console.log(file)

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail = emailList.map(function(item){return item.A})
        console.log(totalemail)
        setEmailList(totalemail)

    }

    reader.readAsBinaryString(file);

 }

 function send()
 {
  setstatus(true)
  axios.post("http://localhost:5000/sendemail",{msg:msg,emailList:emailList})
  .then(function(data)
  {
    if(data.data === true)
    {
      alert("Email Sent Successfully")
      setstatus(false)
    }
    else{
      alert("Failed")
    }
  })
}

 return (
  <div className="min-h-screen bg-slate-100 flex flex-col">

    {/* Header */}
    <header className="bg-blue-950 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold tracking-wide">BulkMail</h1>
      </div>
    </header>

    {/* Intro banner */}
    <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center px-6 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold max-w-2xl mx-auto leading-snug">
        Send one message to your whole email list in a single click
      </h2>
      <p className="mt-3 text-blue-100">
        Write your message, upload your Excel file, and press Send.
      </p>
    </section>

    {/* Main card */}
    <main className="flex-1 px-4 -mt-6 pb-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Your message
        </label>
        <textarea
          onChange={handlemsg}
          value={msg}
          className="w-full h-40 p-3 text-slate-800 border border-slate-300 rounded-lg outline-none resize-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          placeholder="Enter the email text ...."
        ></textarea>

        <label className="block text-sm font-semibold text-slate-700 mt-6 mb-2">
          Email list (Excel file)
        </label>
        <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-6 text-center hover:bg-blue-100">
          <input
            type="file"
            onChange={handlefile}
            className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-700 file:text-white file:font-medium hover:file:bg-blue-800 file:cursor-pointer"
          />
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Total emails in the file:{" "}
          <span className="inline-block bg-blue-100 text-blue-900 font-semibold px-2 py-0.5 rounded-md">
            {emailList.length}
          </span>
        </p>

        <button
          onClick={send}
          className="mt-6 w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg shadow"
        >
          {status ? "Sending..." : "Send"}
        </button>

      </div>
    </main>

    {/* Footer */}
    <footer className="bg-blue-950 text-blue-200 text-center text-sm py-4">
      BulkMail
    </footer>

  </div>
 )
}

export default App;