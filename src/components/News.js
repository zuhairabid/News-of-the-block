import axios from "axios"
import React, { useEffect, useState } from "react"
import moment from "moment"

const News = () => {
   const [loading, setLoading] = useState(true)
   const [news, setNews] = useState([])

   const demoImage =
      "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News"

   const fetchNews = async () => {
      //   const { data } = await axios.get(
      //      "https://newsapi.org/v2/everything?q=bitcoin&apiKey=07a4378a5a8b47769836f17bf9a87fd5"
      //   )

      const options = {
         method: "GET",
         url: "https://bing-news-search1.p.rapidapi.com/news/search",
         params: {
            q: "crypto news",
            count: "20",
            freshness: "Day",
            textFormat: "Raw",
            safeSearch: "Off",
         },
         headers: {
            "X-BingApis-SDK": "true",
            "X-RapidAPI-Key":
               "c85c54d697msh2d6bc0082e34a71p1fdea7jsn4c08dd282158",
            "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
         },
      }

      await axios
         .request(options)
         .then(function (response) {
            console.log(response.data.value)
            setNews(response.data.value)
            setLoading(false)
         })
         .catch(function (error) {
            console.error(error)
         })
      //   const { data } = await axios.get("http://127.0.0.1:3000/data.json")
      //   console.log(data)
      //   setNews(data.value)
   }
   useEffect(() => {
      fetchNews()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className="font-mons">
         <div>
            <h1 className="text-center text-3xl uppercase font-bold my-10">
               crypto news
            </h1>
         </div>
         {loading ? (
            <div className="linear-activity">
               <div className="indeterminate"></div>
            </div>
         ) : (
            <div className="px-3 grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto ">
               {news.map((i) => {
                  //    console.log(i.image.thumbnail.contentUrl)
                  return (
                     <a href={i.url} className="hover:[&>*]:text-yellow-500">
                        <div className="border border-gray-700 m-2 shadow-lg rounded font-mons flex flex-col text-white z-30 p-2">
                           <div className="flex">
                              <div className="flex flex-col justify-between w-[100%]">
                                 <p className="font-bold text-lg">{i.name}</p>
                              </div>
                              <img
                                 src={
                                    i.image
                                       ? i.image.thumbnail.contentUrl
                                       : demoImage
                                 }
                                 alt=""
                                 className="overflow-hidden w-[100px] h-[87px] ml-2"
                              />
                           </div>
                           <div className="text-xs flex items-center justify-between">
                              <div className="flex items-center mt-3 ">
                                 <img
                                    src={
                                       i.provider[0].image
                                          ? i.provider[0].image.thumbnail
                                               .contentUrl
                                          : ""
                                    }
                                    alt=""
                                    className="w-[20px] h-[20px] mr-2"
                                 />
                                 <span>{i.provider[0].name}</span>
                              </div>
                              <p className="mt-3">
                                 {moment(i.datePublished)
                                    .startOf("ss")
                                    .fromNow()}
                              </p>
                           </div>

                           <p className="mt-4">{i.description}</p>
                        </div>
                     </a>
                  )
               })}
            </div>
         )}
      </div>
   )
}

export default News
