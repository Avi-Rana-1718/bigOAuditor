import { useEffect, useRef, useState } from "react";
import PrimaryDiv from "./_components/PrimaryDiv";
import Footer from "./_components/Footer";
import Nav from "./_components/Nav";

export default function App() {

  let [data, setData] = useState(null)
  let [session, setSession] = useState(null)
  let inputRef = useRef(null);
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
      systemPrompt: "You are an expert DSA bot that computes the time and space complexity in bigO notation of the approach and additional provides simplified code and more DSA approaches for the same input question in the same programming language only. The output should be json format having the following structure: {complexity:{space, time}, analyzedApproach, approachName, simplifiedCode, altApproaches:[{approachName, code}]}. Don't mention the format in the output and always return production ready JSON. Don't include backticks(`) anywhere and also exclude literal control characters! Output should be in a single line!"
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
    //console.log(inputRef.current.innerText);
    submitRef.current.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i>Analyzing`;
    submitRef.current.disabled=true;
    console.log("Processing");    

    try {
      errorRef.current.classList.remove("block");
      errorRef.current.classList.add("hidden");
      let response = await session.prompt(" Don't include backticks(`) anywhere and also exclude literal control characters! Output should be in a SINGLE line! The output should be of the same language of the input. Give analyzed approach like brute force, dynamic programming, two pointer, greedy etc. Make sure the output is not badly parsed! The question is : " + inputRef.current.innerText);
      console.log(response);
      console.log(JSON.parse(response.substring(response.indexOf("{"), response.lastIndexOf("}")+1).replaceAll(" \n", " ").replaceAll('`', `'`).replaceAll("````", "'")));
      
      setData(JSON.parse(response.substring(response.indexOf("{"), response.lastIndexOf("}")+1).replaceAll(" \n", " ").replaceAll('`', `'`).replaceAll("````", "'")));
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

  if(session==null) {
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

          <div className="flex flex-col md:flex-row">

            <PrimaryDiv title="Time complexity">  
              <span className={"bg-[#333333] rounded p-2 inline-block mt-2" + ((data==null)?" animate-pulse":null)}>{(data!=null)?(data.complexity.time):null}</span>
              <a href="https://en.wikipedia.org/wiki/Time_complexity" className="block text-sm mt-2 text-[#C5CC5A] hover:underline">Learn more<i class="fa-solid fa-square-arrow-up-right"></i></a>
            </PrimaryDiv>

            <PrimaryDiv title="Space complexity">
              <span className={"bg-[#333333] rounded p-2 inline-block mt-2" + ((data==null)?" animate-pulse":null)}>{(data!=null)?(data.complexity.space):null}</span>
              <a href="https://en.wikipedia.org/wiki/Space_complexity" className="block text-sm mt-2 text-[#C5CC5A] hover:underline">Learn more<i class="fa-solid fa-square-arrow-up-right"></i></a>
            </PrimaryDiv>

            <PrimaryDiv title="Analyzed approach">
              <span className={"bg-[#333333] rounded p-2 inline-block mt-2" + ((data==null)?" animate-pulse":null)}>{(data!=null)?(data.approachName):null}</span>
            </PrimaryDiv>

          </div>

          <PrimaryDiv title="Simplified code">
            <pre className="bg-[#333333] rounded overflow-scroll text-xs p-3 m-2" dangerouslySetInnerHTML={{__html: (data!=null)?(data.simplifiedCode.replaceAll("'''", "")):"Waiting for input!"}}></pre>
          </PrimaryDiv>

        </section>

        <PrimaryDiv title="Additional approaches">
          <ul  className="md:max-w-[30vw] w-[100vw] mt-4">
            {(data!=null)?(

              (data.altApproaches.length!=0)?(data.altApproaches.map((el, i)=>{
                return (
                <li key={el.approachName}>
                  <h4>{i+1}. {el.approachName}</h4>
                  <pre className="text-xs overflow-scroll bg-[#333333] rounded p-3 m-2">
                    {el.code.replaceAll("'''", "")}
                  </pre>
                </li>
              )
              })):("No alternative approach found!")
            ):("No alternative approach found!")}
          </ul>
        </PrimaryDiv>

    </main>
    <Footer />
    </>
  )
}