import { parseEpub } from "@gxl/epub-parser";
import $ from "jquery";
import { dbGetAssTypeId } from "../indexedDb/dbAssignment";
import { dbSaveSrcData } from "../indexedDb/dbSourceMaterial";

const epubLoadFile = async (fileEPUB) => {
    const getDataEPUB = () => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(fileEPUB);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    const data = await getDataEPUB();
    const result = await parseEpub(data)
    .then (() => {
        return "ok";
    })
    .catch (() => {
        return "error";
    });

    return result;
}

export const isValidEpubMWB = async (fileEPUB) => {
    const isOK = await epubLoadFile(fileEPUB);
    if (isOK === "ok") {
        const getDataEPUB = () => {
            return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(fileEPUB);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    const data = await getDataEPUB();
    const epubData = await parseEpub(data);
    if (epubData.info.author === "WATCHTOWER") {
        var cnData = 0;
        var epubSections = epubData.sections;
        var pgCount = epubSections.length;
        for(let i=0; i < pgCount; i++) {
            var section = epubSections[i];
            let div = $.parseXML(section.htmlString);
            var MeetingSection = div.getElementsByTagName("h2");
            if (MeetingSection.length === 4) {
                var isValidTGW = false;
                var T = div.getElementsByTagName("h2").item(1).parentNode;
                if (T.hasAttribute("class") === true) {
                    if (T.getAttribute("class").includes("treasures") === true) {
                        isValidTGW = true;
                    }
                }
                
                var isValidAYF = false;
                T = div.getElementsByTagName("h2").item(2).parentNode;
                if (T.hasAttribute("class") === true) {
                    if (T.getAttribute("class").includes("ministry") === true) {
                        isValidAYF = true;
                    }
                }
                
                var isValidLC = false;
                T = div.getElementsByTagName("h2").item(3).parentNode;
                if (T.hasAttribute("class") === true) {
                    if (T.getAttribute("class").includes("christianLiving") === true) {
                        isValidLC = true;
                    }
                }

                if (isValidTGW === true && isValidAYF === true && isValidLC === true) {
                    cnData++;
                }
            };
        };

        if (cnData > 0) {
            return true;
        } else {
            return false;
        };
    } else {
        return false;
    }
    } else {
        return false;
    }
}

const extractEpubToString = async (fileEPUB, mwbYear) => {
    var result = [];
    const getDataEPUB = () => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(fileEPUB);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    const data = await getDataEPUB();
    const epubData = await parseEpub(data);
    var epubSections = epubData.sections;
    var pgCount = epubSections.length;
    for(let i=0; i < pgCount; i++) {
        var section = epubSections[i];
        var isValidData = false;
        let div = $.parseXML(section.htmlString);
        var MeetingSection = div.getElementsByTagName("h2");
        if (MeetingSection.length === 4) {
            var isValidTGW = false;
            var T = div.getElementsByTagName("h2").item(1).parentNode;
            if (T.hasAttribute("class") === true) {
                if (T.getAttribute("class").includes("treasures") === true) {
                    isValidTGW = true;
                }
            }
            
            var isValidAYF = false;
            T = div.getElementsByTagName("h2").item(2).parentNode;
            if (T.hasAttribute("class") === true) {
                if (T.getAttribute("class").includes("ministry") === true) {
                    isValidAYF = true;
                }
            }
            
            var isValidLC = false;
            T = div.getElementsByTagName("h2").item(3).parentNode;
            if (T.hasAttribute("class") === true) {
                if (T.getAttribute("class").includes("christianLiving") === true) {
                    isValidLC = true;
                }
            }

            if (isValidTGW === true && isValidAYF === true && isValidLC === true) {
                isValidData = true;
            }
        };
        
        if (isValidData === true) {
            var obj = {};
            var wdHtml = div.getElementsByTagName("h1");
            var weekDate = wdHtml[0].innerText;
            
            weekDate = weekDate.replace(" ", " ")
            var dayParse = weekDate.split("-");
            var varDay;
            var varMonth;
            var monthParse;
            var src = "";
            var cnAYF = 1;
            if (dayParse.length === 2) {
                varDay = dayParse[0];
                monthParse = dayParse[1].split(" ");
                varMonth = monthParse[1];
                
            } else {
                dayParse = weekDate.split("–");
                monthParse = dayParse[0].split(" ");
                varDay = monthParse[0];
                varMonth = monthParse[1];
            }

            var monthIndex = 0;
            if (varMonth === "Janoary") {
                monthIndex = 0
            } else if (varMonth === "Febroary") {
                monthIndex = 1
            } else if (varMonth === "Martsa") {
                monthIndex = 2
            } else if (varMonth === "Aprily") {
                monthIndex = 3
            } else if (varMonth === "Mey") {
                monthIndex = 4
            } else if (varMonth === "Jona") {
                monthIndex = 5
            } else if (varMonth === "Jolay") {
                monthIndex = 6
            } else if (varMonth === "Aogositra") {
                monthIndex = 7
            } else if (varMonth === "Septambra") {
                monthIndex = 8
            } else if (varMonth === "Oktobra") {
                monthIndex = 9
            } else if (varMonth === "Novambra") {
                monthIndex = 10
            } else if (varMonth === "Desambra") {
                monthIndex = 11
            }

            var schedDate = new Date(mwbYear, monthIndex, varDay);
            var dateFormat = require("dateformat");
            const dateToAdd = dateFormat(schedDate, "mm/dd/yyyy");

            src+= dateToAdd;
            
            MeetingSection = div.getElementsByTagName("div");
            for(let a=0; a < MeetingSection.length; a++) {
                for(let b=1; b <= 4; b++) {
                    var idSection = "section" + b;
                    if (MeetingSection[a].getAttribute("id") === idSection) {
                        var MeetingPart = MeetingSection[a].children;
                        for(let c=0; c < MeetingPart.length; c++) {
                            if (MeetingPart.item(c).className === "pGroup") {
                                var part1 = MeetingPart.item(c).children;
                                for(let d=0; d < part1.length; d++) {
                                    var part2 = part1.item(d).children;
                                    for(let e=0; e < part2.length; e++) {
                                        var part3 = part2.item(e).children;
                                        for(let f=0; f < part3.length; f++) {
                                            if (part3.item(f).nodeName === "p") {
                                                src+= "|" + part3.item(f).innerText.replace(" ", " ");
                                            };
                                        }
                                    }
                                }
                                break;
                            }
                        }

                        if (b === 3) {
                            cnAYF = 0;
                            for(let c=0; c < MeetingPart.length; c++) {
                                if (MeetingPart.item(c).className === "pGroup") {
                                    part1 = MeetingPart.item(c).children;
                                    for(let d=0; d < part1.length; d++) {
                                        part2 = part1.item(d).children;
                                        cnAYF = part2.length;
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }

            obj.src = src;
            obj.cnAYF = cnAYF;
            result.push(obj);
        };
    };
    return result;
}

export const addEpubDataToDb = async (fileEPUB, mwbYear) => {
    const data = await extractEpubToString(fileEPUB, mwbYear);
    for(let i=0; i < data.length; i++) {
        console.log(data[i]);
        const src = data[i].src;
        const cnAYF = data[i].cnAYF;;

        var obj = {};
        var toSplit = src.split("|");
        var toSplit1;
        var assType = "";
        var assSource = "";

        //WeekOf Source
        toSplit1 = toSplit[0];
        obj.weekOf = toSplit1;

        //Bible Reading Source
        toSplit1 = toSplit[5].split(".)");
        obj.bibleReading_src = toSplit1[1].trim();

        //AYF1 Assignment Type
        toSplit1 = toSplit[6].split(": (");
        assType = toSplit1[0];
        assType = assType.trim();
        assType = await dbGetAssTypeId(assType);
        if (assType === "") {
            assType = "7"
        }
        obj.ass1_type = assType;

        //AYF1 Assignment Time
        toSplit1 = toSplit[6].split(": (");
        toSplit1 = toSplit1[1].split(" ");
        obj.ass1_time = toSplit1[0];

        //AYF1 Assignment Source
        if (assType === "7") {
            assSource = toSplit[6];
        } else {
            toSplit1 = toSplit[6].split("min.) ");
            assSource = toSplit1[1];
        }
        obj.ass1_src = assSource;

        obj.ass2_type = "";
        obj.ass2_time = "";
        obj.ass2_src = "";
        obj.ass3_type = "";
        obj.ass3_time = "";
        obj.ass3_src = "";

        if (cnAYF > 1) {
            //AYF2 Assignment Type
            toSplit1 = toSplit[7].split(": (");
            assType = toSplit1[0];
            assType = assType.trim();
            assType = await dbGetAssTypeId(assType);
            if (assType === "") {
                assType = "7"
            }
            obj.ass2_type = assType;

            //AYF2 Assignment Time
            toSplit1 = toSplit[7].split(": (");
            toSplit1 = toSplit1[1].split(" ");
            obj.ass2_time = toSplit1[0];

            //AYF2 Assignment Source
            if (assType === "7") {
                assSource = toSplit[7];
            } else {
                toSplit1 = toSplit[7].split("min.) ");
                assSource = toSplit1[1];
            }
            obj.ass2_src = assSource;
        }

        if (cnAYF > 2) {
            //AYF3 Assignment Type
            toSplit1 = toSplit[8].split(": (");
            assType = toSplit1[0];
            assType = assType.trim();
            assType = await dbGetAssTypeId(assType);
            if (assType === "") {
                assType = "7"
            }
            obj.ass3_type = assType;

            //AYF3 Assignment Time
            toSplit1 = toSplit[8].split(": (");
            toSplit1 = toSplit1[1].split(" ");
            obj.ass3_time = toSplit1[0];

            //AYF3 Assignment Source
            if (assType === "7") {
                assSource = toSplit[8];
            } else {
                toSplit1 = toSplit[8].split("min.) ");
                assSource = toSplit1[1];
            }
            obj.ass3_src = assSource;
        }

        obj.week_type = 1;
        obj.noMeeting = false;
        obj.isOverride = false;

        await dbSaveSrcData(obj);
    }
}