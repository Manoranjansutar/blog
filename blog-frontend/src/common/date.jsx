let months = ["jan","feb","mar","april","may","jun","jul","aug","sept","oct","nov","dec"];
let days = ["sunday","monday","tueday","wedday","thursday","friday","saturday"]

export const getDay = (timeStamp) =>{
    let date = new Date(timeStamp)
    return `${date.getDate()} ${months[date.getMonth()]}`
}