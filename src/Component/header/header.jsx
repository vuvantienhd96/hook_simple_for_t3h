import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { PageHeader, Card } from 'antd';
import './header.css'

// this here ?
export default function Header() {
    // declare useRef
    const inputEl = useRef(null);

    // khai bao state with hoook
    const [isToggle, setIsToggle] = useState(false);
    const [valueInput, setValueInput] = useState("");
    
    const handleClickToggle = useCallback(
        () => {
            setIsToggle(!isToggle);
        }, [isToggle]);


    const listUser = (isToggle) => {
        return <p><span style={{fontWeight: 500}}> {isToggle ? 'xin chao' : 'tambiet'} </span>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Expedita impedit nisi ex dolorem quisquam animi cum placeat at! 
            Nam omnis cum dignissimos id adipisci perspiciatis est nulla sit nobis molestias.</p>
    }


    let listMemo = useMemo(() => listUser(isToggle), [isToggle])

    // Lycle didMount, update, unmount
    useEffect(() => {

        // effect
        fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json))
        return () => {
            // unmount effect
           return false;
        }
    }, [])

    // 
    const onButtonClick = () => {
        //inputEl.current.focus();

        console.log('value input', valueInput);
        inputEl.current.value = ''
        
    }

    const changeValueInput = () =>{
        setValueInput(inputEl.current.value)
    }
 
     
     

    return (
        <React.Fragment>
            <PageHeader
                className="site-page-header"
                onBack={ handleClickToggle }
                title="Title"
                subTitle="This is a subtitle"
            />
            {isToggle && <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>}

            {listMemo}

            <h2>Using ref</h2>
            <input ref={inputEl} type="text" onChange={changeValueInput} value={valueInput}/>
            <button onClick={onButtonClick}>Focus the input</button>

        </React.Fragment>
    )
}
