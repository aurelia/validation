/*
* An abstract base class for implementations of an ErrorRenderer class. This should be generic enough to be used on both the client and the server.
*/
export class ErrorRenderer {
    /*
     * attachToNode - This function is implemented by templating-validation in order to display errors for the end-user.
     * @param node : Element - This is the node which the validation-group is attached to.
     * @param validationGroup : ValidationGroup - This is the group of validations to run against the value of this node.
     * @return val : Boolean - This returns true for successful attaching of validation-group and false otherwise.
     */
    attachToNode(node: Element, validationGroup: ValidationGroup): boolean {
        throw new Error('ErrorRenderer must implement an attachToNode method!');
    }
    /*
     * detachFromNode - This function is implemented by templating-validation in order to remove errors for the end-user.
     * @param node : Element - This is the node which the validation-group is removed from.
     * @param validationGroup : ValidationGroup - This is the group of validations to remove from the node.
     * @return val : Boolean - This returns true for successful detaching of validation-group and false otherwise.
     */
    detachFromNode(node: Element, validationGroup: ValidationGroup): boolean {
        throw new Error('ErrorRenderer must implement a detachFromNode method!');
    }

}
