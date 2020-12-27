// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

// OpenZeppelin ERC20
import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// ADBK math for int128 -> 64.64 signed fixed point numbers
import {ABDKMath64x64 as Ak} from "abdk-libraries-solidity/ABDKMath64x64.sol";

contract FairCoin is Context, IERC20 {
    using SafeMath for uint256;

    /* naming convention : all int128 names actually representing IEEE 64.64 fixed point numbers starts with 'ABDK_'
     * since I use ABDK's library to manipulate them
     */

    // please consider the output of balanceOf(account) as the real balance of an account.
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    
    // must not exceed 9223372036854775807
    // suggested :     5000000000000000000
    uint256 private _totalSupply;
    
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    
    // FairCoin added parameters
    uint private numberOfRecipients;
    mapping(address => bool) private isRecipient;
    int128 private ABDK_redistributionRate;
    mapping(address => uint) private dateOfLastOperation;
    uint256 private creationDate;
    
    int128 immutable private ABDK_minusOne = Ak.fromInt(-1);

    // FairCoin's implementation
    constructor (string memory name_, string memory symbol_, address[] memory originalRecipients, uint totalSupply, int redistributionRatePercentage) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
        _totalSupply = totalSupply; // arbitrary choice
        creationDate = block.timestamp;
        
        // should be modifiable in future implementations
        ABDK_redistributionRate = Ak.div(Ak.fromInt(redistributionRatePercentage),Ak.fromInt(100)); // simulates a 4% inflation
        
        numberOfRecipients = originalRecipients.length;
        for(uint i = 0; i < originalRecipients.length; i++){
            _balances[originalRecipients[i]] = _totalSupply/originalRecipients.length;
            isRecipient[originalRecipients[i]] = true;
        }
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    // FairCoin's implementation
    function balanceOf(address account) public view override returns (uint256) {
        /* F : redistribution factor
         * Q : total supply
         * N : number of recipients
         * t : elapsed time since last operation
         * s(t) : according to the redidtribution strategy, 
         * calculates the new balance of an account from a chosen date considered the origin 0, after the time t is elapsed 
         */
         
        // if the account was never involved in a transaction, we calculate the redidtribution since contract creation.
        uint trueDateOfLastOperation = dateOfLastOperation[account] == 0 ? creationDate : dateOfLastOperation[account];
        
        // time elapsed in years = (now - dateOfLastTransaction) / years
        int128 ABDK_elapsedTimeSinceLastTransaction = 
            Ak.div(
                Ak.sub(
                    Ak.fromInt(int256(block.timestamp)),
                    Ak.fromInt(int256(trueDateOfLastOperation))),
                Ak.fromInt(365 days));
        
        // e^(-F*t)
        int128 ABDK_expMinusFTimesT = 
            Ak.exp(
                Ak.mul(
                    ABDK_elapsedTimeSinceLastTransaction,
                    Ak.mul(
                        ABDK_redistributionRate,
                        ABDK_minusOne)));
               
        // (Q/N)*(1-e^(-F*t))         
        int128 ABDK_allocationPart = 
            Ak.mul(
                Ak.sub(
                    Ak.fromInt(1),
                    ABDK_expMinusFTimesT),
                Ak.div(
                    Ak.fromInt(int256(_totalSupply)),
                    Ak.fromInt(int256(numberOfRecipients))));
                    
        // s(0)*e^(-F*t)
        int128 ABDK_taxPart = 
            Ak.mul(
                Ak.fromInt(int256(_balances[account])),
                ABDK_expMinusFTimesT);
        
        // s(t) = (Q/N)*(1-e^(-F*t)) + s(0)*e^(-F*t)
        return isRecipient[account] ?
                Ak.toUInt(
                    Ak.add(
                        ABDK_allocationPart,
                        ABDK_taxPart))
            :
                Ak.toUInt(ABDK_taxPart);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }
    
    // FairCoin's implementation
    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = balanceOf(sender).sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = balanceOf(recipient).add(amount);
        dateOfLastOperation[sender] = block.timestamp;
        dateOfLastOperation[recipient] = block.timestamp;
        
        emit Transfer(sender, recipient, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    // _mint, _burn, _beforeTokenTransfer and _setupDecimals functions are not needed for this implementation, so they have been deleted
}