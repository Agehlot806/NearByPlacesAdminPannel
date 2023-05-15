import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/User.js";
import { Store } from "../models/Stores.js";
import csv from "csvtojson";
// import CsvParser from "json2csv";
import { Parser } from "json2csv";
import { Offer } from "../models/Offer.js";
import { Event } from "../models/Event.js";
import { Message } from "../models/Messages.js";

export const usercsvdata = catchAsyncError(async(req,res,next)=> {
    let users = [];
    const userData =await User.find({});
    userData.forEach((user)=>{
      const {name,email,_id,role} = user;
      users.push({name,email,_id,role})
    });
    const csvfields = ["name","email","role","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(users);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-usersData.csv");
    res.status(200).end(CSvData);
  
  })
  export const SingleUserCsvData = catchAsyncError(async(req,res,next)=> {
    let singleusers = [];
    const singleUserData =await User.findById(req.params.id);
    const {name,email,_id,role}=singleUserData;
    singleusers.push({name,email,_id,role});
    const csvfields = ["name","email","role","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(singleusers);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-singleuserData.csv");
    res.status(200).end(CSvData);
  
  })



  export const Storecsvdata = catchAsyncError(async(req,res,next)=> {
    let stores = [];
    const storeData =await Store.find({});
    storeData.forEach((store)=>{
      const {name,_id} = store;
      stores.push({name,_id})
    });
    const csvfields = ["name","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(stores);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-usersData.csv");
    res.status(200).end(CSvData);
  
  })


  export const SingleStoreCsvData = catchAsyncError(async(req,res,next)=> {
    let singlestore= [];
    const singleStoreData =await Store.findById(req.params.id);
    const {name,_id}=singleStoreData;
    singlestore.push({name,_id});
    const csvfields = ["name","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(singlestore);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-singlestoreData.csv");
    res.status(200).end(CSvData);
  
  })



  export const Offercsvdata = catchAsyncError(async(req,res,next)=> {
    let offers = [];
    const offerData =await Offer.find({});
    offerData.forEach((offer)=>{
      const {name,_id} = offer;
      offers.push({name,_id})
    });
    const csvfields = ["name","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(offers);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-offersData.csv");
    res.status(200).end(CSvData);
  
  });

  export const SingleOfferCsvData = catchAsyncError(async(req,res,next)=> {
    let singleoffer= [];
    const singleOfferData =await Offer.findById(req.params.id);
    const {name,_id}=singleOfferData;
    singleoffer.push({name,_id});
    const csvfields = ["name","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(singleoffer);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-singleofferData.csv");
    res.status(200).end(CSvData);
  
  })

  export const Eventcsvdata = catchAsyncError(async(req,res,next)=> {
    let events = [];
    const EventsData =await Event.find({});
    EventsData.forEach((event)=>{
      const {eventname,_id} = event;
      events.push({eventname,_id})
    });
    const csvfields = ["eventname","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(events);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-eventsData.csv");
    res.status(200).end(CSvData);
  
  })


  export const SingleEventCsvData = catchAsyncError(async(req,res,next)=> {
    let singleevent= [];
    const singleEventData =await Event.findById(req.params.id);
    const {eventname,_id}=singleEventData;
    singleevent.push({eventname,_id});
    const csvfields = ["eventname","_id"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(singleevent);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-singleeventData.csv");
    res.status(200).end(CSvData);
  
  })


  
  export const Messagescsvdata = catchAsyncError(async(req,res,next)=> {
    let messages = [];
    const MessageData =await Message.find({});
    MessageData.forEach((msg)=>{
      const {user,username,_id,message} = msg;
      messages.push({user,username,message,_id})
    });
    const csvfields = ["user","_id","username","message"];
    const csvParser  = new Parser({csvfields});
    const CSvData = csvParser.parse(messages);
    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attatchment:filename-alluserMessageData.csv");
    res.status(200).end(CSvData);
  
  })