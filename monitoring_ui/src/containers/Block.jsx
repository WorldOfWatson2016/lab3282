/*****************************************************************************
Copyright (c) 2016 IBM Corporation and other Contributors.


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.


Contributors:

Alex Nguyen - Initial Contribution 
*****************************************************************************/
import { connect } from 'react-redux'
import { fetchBlockData } from '../actions/BlockActions'
import React from 'react'
import BlockView from '../components/BlockView.jsx'

class Block extends React.Component{

  constructor(props){
    super(props)

  }

  //when the block is instantiated, we load block information from the server.
  //block information can't change, so we just load once.
  componentDidMount(){
    //this.loadBlockInfoFromServer(this.props.url);
    this.props.fetchBlockData(this.props.blockNumber)
  }

  render(){
    return(
      <BlockView {...this.props} />
    )
  }

}

const mapStateToProps = (state, ownProps) =>{
  //calculate the inverse
  let adjustedIndex = state.blockchain[0].blockNumber - ownProps.blockNumber;
  let currBlock = state.blockchain[adjustedIndex];
  currBlock.urlRestRoot = state.configuration.urlRestRoot;
  return currBlock;
}

const mapDispatchToProps = (dispatch) =>{
  return{
    fetchBlockData: (blockNumber) => {
      dispatch(fetchBlockData(blockNumber))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Block)
