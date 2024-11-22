import { useEffect, useRef, useState } from "react";
import PrimaryDiv from "./_components/PrimaryDiv";
import Footer from "./_components/Footer";
import Nav from "./_components/Nav";

export default function App() {

  let [data, setData] = useState(null)
  let [raw, setRaw] = useState("Wating for input!            ")
  let [session, setSession] = useState(null)
  let inputRef = useRef(null);

  let timeRef = useRef(null);
  let spaceRef = useRef(null);
  let approachRef = useRef(null);
  let moreRef = useRef(null);

  let submitRef = useRef(null);
  let errorRef = useRef(null);

  useEffect(()=>{  
    setUp();
  }, [])

  async function setUp() {
    if (!self.ai || !self.ai.languageModel) {
      return;
    }
  
    setSession(await ai.languageModel.create({
      temperature: Number(1),
      topK: Number(1),
      systemPrompt: "You are an expert DSA bot. Try to answer everything in the least amount of words, provide no explanation. Always return English and do not include accents! The input will always be in english and always contain code."
    }));
    console.log("Created!");
  }

  function reset() {
    session.destroy()
    setSession(null)
    //inputRef.current.innerHTML=null;
    setUp();
  }
  

  async function getResponse() {
    submitRef.current.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i>Analyzing`;
    submitRef.current.disabled=true;
    console.log("Processing");    

    try {
      errorRef.current.classList.remove("block");
      errorRef.current.classList.add("hidden");
      console.log(inputRef.current.innerText.trim().replaceAll("\n", "").replaceAll("\t", ""));
      
      let stream = await session.promptStreaming("Output the space, time complexity,  the analyzed approach used (like Brute force, Dynamic programming) and more approaches in the following format: 'time: , space: , analyzedApproach: , moreApproaches: '." + inputRef.current.innerText.replaceAll("\t", "").replaceAll("\n", ""));
    
      for await (const chunk of stream) {
        let res = chunk.trim();
        setRaw(res)
        res=res.replaceAll('`', "")
        let output = res.split(",");
        
        
        if(res.includes("time: ")) {
          timeRef.current.innerText=output[0].substring(output[0].indexOf("time: ") + "time: ".length).trim();
        }
        if(res.includes("space: ")) {
          spaceRef.current.innerText = output[1].substring(output[1].indexOf("space: ") + "space: ".length).trim();
        }
        if(res.includes("analyzedApproach: ")) {
          approachRef.current.innerText = output[2].substring(output[2].indexOf("analyzedApproach: ") + "analyzedApproach: ".length).trim();
        }
        if(res.includes("moreApproaches:")) {
          let data = res.substring(res.indexOf("moreApproaches:") + "moreApproaches: ".length).trim();
          console.log("OUTPUT:")
          data=data.split(/approachName|link/g);       
  
          setData(data)
        }
        
      }
      
      const { maxTokens, temperature, tokensLeft, tokensSoFar, topK } = session;

      console.log(maxTokens, temperature, tokensLeft, tokensSoFar, topK);
    } catch(err) {
      //handle error
      console.log(err);
      
      errorRef.current.classList.add("block");
      errorRef.current.classList.remove("hidden");
      errorRef.current.innerHTML='<i class="fa-solid fa-triangle-exclamation mr-1"></i>' +  err;
    }

    submitRef.current.disabled=false;
    submitRef.current.innerHTML="Submit";
  }

  if(!self.ai || !self.ai.languageModel) {
    return (
      <>
        <Nav />
        <PrimaryDiv className="p-3">
          <div>
            <h4 className="text-xl text-[#C5CC5A]">OOPS!</h4>
            Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview" className="underline hover:text-[#888]">Early Preview Program</a> to enable it.
            <br /><br />
          </div>
        </PrimaryDiv>
        <Footer/>
      </>
    )
  }

  return (
    <>
    <Nav />
    <main className="md:flex w-full">
        <PrimaryDiv title="Analyze code">
          <div className="max-h-[50lvh] md:max-h-[90vh] h-[100vh] md:max-w-[32vw]">
            <small
            disabled={true}
            className="text-sm bg-[#c46d52b6] p-2 rounded m-2 hidden"
            ref={errorRef}
            ></small>
            <pre
            className="bg-[#333333] rounded resize-none p-2.5 md:max-w-[30vw] max-h-[15lvh] md:max-h-[60lvh] h-full m-2 overflow-scroll text-sm"
            contentEditable
            spellCheck={false}
            ref={inputRef}
            placeholder="Paste your code here!"
            onPaste={(e)=>{
              e.preventDefault();
              document.execCommand('inserttext', false, event.clipboardData.getData('text/plain'));
            }}
            ></pre>
            <button
            className="bg-[#514f4f] px-3 py-1 rounded ml-2 hover:bg-[#434242] hover:underline disabled:bg-[#292a26] disabled:hover:no-underline"
            onClick={getResponse}
            ref={submitRef}
            >Submit</button>
            <button
            className="bg-[#514f4f] px-3 py-1 rounded ml-2 hover:bg-[#434242] hover:underline disabled:bg-[#292a26] disabled:hover:no-underline"
            onClick={reset}
            title="Reset the model"
            >Reset</button>
            <small
            disabled={true}
            className="bg-[#5e5d5d] p-2 rounded m-2 block text-xs"
            >
              <h6 className="underline mb-0.5"><i class="fa-solid fa-circle-info mr-1 ml-0"></i>Note</h6>
              The following output are generated with the help of AI and can be wrong.
            </small>
          </div>
        </PrimaryDiv>

        <section className="md:max-w-[30vw]">

          <div className="flex flex-col md:flex-col">

            <PrimaryDiv title="Time complexity">  
              <span ref={timeRef} className={"bg-[#333333] rounded p-2 inline-block mt-2"}></span>
              <a href="https://en.wikipedia.org/wiki/Time_complexity" className="block text-sm mt-2 text-[#C5CC5A] hover:underline">Learn more<i class="fa-solid fa-square-arrow-up-right"></i></a>
            </PrimaryDiv>

            <PrimaryDiv title="Space complexity">
              <span ref={spaceRef} className={"bg-[#333333] rounded p-2 inline-block mt-2"}></span>
              <a href="https://en.wikipedia.org/wiki/Space_complexity" className="block text-sm mt-2 text-[#C5CC5A] hover:underline">Learn more<i class="fa-solid fa-square-arrow-up-right"></i></a>
            </PrimaryDiv>

            <PrimaryDiv title="Analyzed approach">
              <span ref={approachRef} className={"bg-[#333333] rounded p-2 inline-block mt-2"}></span>
            </PrimaryDiv>
            <PrimaryDiv title="Additional approaches">
                <ul className="list-none bg-[#333333] rounded resize-none p-2.5 md:max-w-[30vw] max-h-[15lvh] md:max-h-[60lvh] h-full m-2 overflow-scroll text-wrap block"
                >
                  {(data!=null)?(
                  data.map((el, i)=>{
                    return <li key={el+i}>{el}</li>
              })
                ):null}
                </ul>
            </PrimaryDiv>
          </div>

        </section>

        <PrimaryDiv title="Raw response">
          <pre 
          className="bg-[#333333] rounded resize-none p-2.5 md:max-w-[30vw] max-h-[15lvh] md:max-h-[60lvh] h-full m-2 overflow-scroll text-wrap block"
          >
          {raw}
          </pre>
        </PrimaryDiv>

    </main>
    <Footer />
    </>
  )
}