import React, { useState} from "react";
import Create from "./Create";


export default function Home(){
    const [todos, setTodos] = useState([])
    return (
        <div>
            <h1>Todo List</h1>
            
            {
                todos.length === 0 
                ?
                <div> <h3>Nothing To Do</h3> </div>
                :
                todos.map(todo => (
                    <div>
                        {todo}
                    </div>
                ))
            }
            <Create />
        </div>
    )
}