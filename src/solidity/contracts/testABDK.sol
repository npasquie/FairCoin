// SPDX-License-Identifier: MIT

pragma solidity 0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

// ADBK math for int128 -> 64.64 signed fixed point numbers
import {ABDKMath64x64 as Ak} from "abdk-libraries-solidity/ABDKMath64x64.sol";

contract Test {
    using SafeMath for uint256;
    
    /* naming convention : all int128 names actually representing IEEE 64.64 fixed point numbers starts with ABDK_
     * since I use ABDK's library to manipulate them
     */

    int128 immutable ABDK_minusOne = Ak.fromInt(-1);
    
    // must not exceed uint64's max value : 18,446,744,073,709,551,615 with 18 decimals, that makes ~9.222 max :(
    int128 immutable ABDK_totalSupply = Ak.fromInt(100*30000); // 100 persons, average wealth 30k
    int128 immutable ABDK_numberOfRecipients = Ak.fromInt(100);
    int128 immutable ABDK_redistributionFactor = Ak.div(Ak.fromInt(4),Ak.fromInt(100)); // 4% of redistribution a year
    
    // please consider the output of balanceOf(account) as the real balance of an account.
    mapping (address => uint256) private _balances;

    mapping(address => uint) private dateOfLastOperation;

    function balanceOf(address account) private view returns(uint256){
        /* F : redistribution factor
         * Q : total supply
         * N : number of recipients
         * t : elapsed time since last operation
         * s(t) : according to the redidtribution strategy, 
         * calculates the new balance of an account from a chosen date considered the origin 0, after the time t is elapsed 
         */
        
        // time elapsed in years = (now - dateOfLastTransaction) / years
        int128 ABDK_elapsedTimeSinceLastTransaction = 
            Ak.div(
                Ak.sub(
                    Ak.fromInt(int256(block.timestamp)),
                    Ak.fromInt(int256(dateOfLastOperation[account]))),
                Ak.fromInt(365 days));
        
        // e^(-F*t)
        int128 ABDK_expMinusFTimesT = 
            Ak.exp(
                Ak.mul(
                    ABDK_elapsedTimeSinceLastTransaction,
                    Ak.mul(
                        ABDK_redistributionFactor,
                        ABDK_minusOne)));
        
        // s(t) = (Q/N)*(1-e^(-F*t)) + s(0)*e^(-F*t)
        return
            Ak.toUInt(
                Ak.add(
                    Ak.mul(
                        Ak.sub(Ak.fromInt(1),ABDK_expMinusFTimesT),
                        Ak.div(ABDK_totalSupply,ABDK_numberOfRecipients)),
                    Ak.mul(
                        Ak.fromInt(int256(_balances[account])),
                        ABDK_expMinusFTimesT)));
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        // not needed ? 
        //_beforeTokenTransfer(sender, recipient, amount);

        _balances[sender] = balanceOf(sender).sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = balanceOf(recipient).add(amount);
        dateOfLastOperation[sender] = block.timestamp;
        dateOfLastOperation[recipient] = block.timestamp;
        
        // emit Transfer(sender, recipient, amount);
    }
    
    // mock and test
    function CLICKME(int szero, int time) public returns(uint256){
        _balances[0x32Be343B94f860124dC4fEe278FDCBD38C102D88] = uint(szero);
        dateOfLastOperation[0x32Be343B94f860124dC4fEe278FDCBD38C102D88] = uint256(block.timestamp) - uint256((time * (365 days)));
        return balanceOf(0x32Be343B94f860124dC4fEe278FDCBD38C102D88);
    }
}