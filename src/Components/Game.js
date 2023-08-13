import React, { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { get960Fen } from '../data/960Moves'

function Game({type,resetGame}) {

    const [moves,setMoves] = useState([])
    const [possibleMoves,setPossibleMoves] = useState([])

    const [chess] = useState(new Chess())

    useEffect(() => {
        if (type == "960") {
            chess.reset();
            chess.load(get960Fen())
            type=null
        }
        setPossibleMoves(chess.moves({verbose:true}))
    },[])

    const handlePieceClick = (tile) => {
        if (tile.square) {
            console.log(chess.moves({...tile,verbose:true}))
            setMoves(chess.moves({...tile,verbose:true}))
        }
    }

    const handleMoveClick = (move) => {
        chess.move(move)
        setMoves([])
        setPossibleMoves(chess.moves({verbose:true}))
        console.log(chess.ascii())
    }

    const getTurn = (turn) => {
        switch (turn) {
            case "b": return "Black"
            case "w": return "White"
        }
    }

    const getHeader = () => {
        if (chess.isCheckmate())
            return "Checkmate"
        if (chess.isStalemate())
            return "Stalemate"
        if (chess.isDraw())
            return "Draw"
        if (chess.isCheck())
            return "Check"
        return "Play"
    }

    const makeRandomMove = () => {
        const moves = chess.moves()
        const move = moves[Math.floor(Math.random() * moves.length)]
        handleMoveClick(move)
    }

    return (
        <>
            <h2>{chess.isGameOver() ? "Game Over" : `${getTurn(chess.turn())}'s Turn`}</h2>
            <h3>{getHeader()}</h3>
            <div id='board'>{chess.board().map((row,r) => (
                <div key={r} className='row'>{row.map((tile,c) => {
                    let square = (c+10).toString(36)+((r)*-1+8)
                    if (!chess.isGameOver()) {
                        let moveTo = moves.filter(move => move.to.match(square))?.[0]
                        let moveFrom = moves.filter(move => move.from.match(square))?.[0]
                        let possibleMoveFrom = possibleMoves.filter(move => move.from.match(square))?.[0]
                        let clickMethod = null;
                        if (moveFrom) {
                            clickMethod = () => setMoves([])
                        } else if (tile && tile.color == chess.turn()) {
                            clickMethod = () => handlePieceClick({square:tile?.square})
                        } else if (moveTo) {
                            clickMethod = () => handleMoveClick(moveTo)
                        } else {
                            clickMethod = () => setMoves([])
                        }
                        return <div key={square} onClick={clickMethod} className={`tile ${chess.squareColor(square)} ${moveTo ? "possible-move" : ""} ${moveFrom ? "selected-piece" : ""} ${possibleMoveFrom ? "possible-piece" : ""} ${tile?.color}`}><h1 className='tile-text'>{tile?.type}</h1></div>
                    } else {
                        return <div key={square} className={`tile ${chess.squareColor(square)} ${tile?.color}`}><h1 className='tile-text'>{tile?.type}</h1></div>
                    }
                    
                })}</div>
            ))}</div>
            {chess.isGameOver() ? <></> : <button onClick={makeRandomMove}>Random Move</button>}
            <button onClick={resetGame}>Exit</button>
        </>
    )
}

export default Game