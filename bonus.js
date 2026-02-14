var longestCommonPrefix = function(strs) {
    

    let isEqual = false ;
    let word = "" ;

    if (strs.length == 1) {
        return strs[0] ;
    }

    for (let j = 0; j < strs[0].length; j++) {

        for (let i = 1; i < strs.length; i++) {

            if (strs[0][j] == strs[i][j]) {

                isEqual = true ;
            } else {
                isEqual = false ;
                break;
            }
        }

        if (isEqual == true) {
            word = word + strs[0][j] ;
        }else{
            break;
        }

    }

    return word
};