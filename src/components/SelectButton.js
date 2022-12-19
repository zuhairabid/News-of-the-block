const SelectButton = ({ children, selected, onClick }) => {
   //    const useStyles = makeStyles({
   //       selectbutton: {
   //          border: "1px solid gold",
   //          borderRadius: 5,
   //          padding: 10,
   //          paddingLeft: 20,
   //          paddingRight: 20,
   //          fontFamily: "Montserrat",
   //          cursor: "pointer",
   //          backgroundColor: selected ? "gold" : "",
   //          color: selected ? "black" : "",
   //          fontWeight: selected ? 700 : 500,
   //          "&:hover": {
   //             backgroundColor: "gold",
   //             color: "black",
   //          },
   //          width: "22%",
   //          //   margin: 5,
   //       },
   //    })

   return (
      <span
         onClick={onClick}
         className={
            selected
               ? "font-bold border border-yellow-400 rounded-md cursor-pointer p-1 px-2 font-mons bg-yellow-400 text-black "
               : " border border-yellow-400 rounded-md cursor-pointer p-1 px-2 font-mons "
         }
      >
         {children}
      </span>
   )
}

export default SelectButton
