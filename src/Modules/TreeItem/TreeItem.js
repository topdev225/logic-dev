import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions  */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { withStyles, useTheme } from '@material-ui/core/styles';
import { useForkRef } from '@material-ui/core/utils';
import TreeViewContext from '../TreeView/TreeViewContext';

var styles = function styles(theme, props) {
  return {
    /* Styles applied to the root element. */
    root: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      outline: 0,
      WebkitTapHighlightColor: 'transparent',
    },

    /* Pseudo-class applied to the root element when expanded. */
    expanded: {},

    /* Styles applied to the `role="group"` element. */
    group: {
      margin: 0,
      padding: 0,
      marginLeft: 26
    },

    /* Styles applied to the tree node content. */
    content: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },

    /* Styles applied to the tree node icon and collapse/expand icon. */
    iconContainer: {
      marginRight: 2,
      width: 24,
      display: 'flex',
      justifyContent: 'center'
    },

    /* Styles applied to the label element. */
    label: {
      width: '100%',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
    },
    selectedLabel: {
      width: '100%',
      backgroundColor: theme.palette.grey[400],
    }
  };
};

var isPrintableCharacter = function isPrintableCharacter(str) {
  return str && str.length === 1 && str.match(/\S/);
};


var TreeItem = React.forwardRef(function TreeItem(props, ref) {
  var children = props.children,
      classes = props.classes,
      className = props.className,
      collapseIcon = props.collapseIcon,
      endIcon = props.endIcon,
      expandIcon = props.expandIcon,
      iconProp = props.icon,
      label = props.label,
      nodeId = props.nodeId,
      onClick = props.onClick,
      onFocus = props.onFocus,
      onKeyDown = props.onKeyDown,
      name = props.name,
      treeiteminfo = props.treeiteminfo,
      _props$TransitionComp = props.TransitionComponent,
      TransitionComponent = _props$TransitionComp === void 0 ? Collapse : _props$TransitionComp,
      TransitionProps = props.TransitionProps,
      other = _objectWithoutProperties(props, ["children", "classes", "className", "collapseIcon", "endIcon", "expandIcon", "icon", "label", "nodeId", "onClick", "onFocus", "onKeyDown", "TransitionComponent", "TransitionProps"]);

  var _React$useContext = React.useContext(TreeViewContext),
      expandAllSiblings = _React$useContext.expandAllSiblings,
      focus = _React$useContext.focus,
      focusFirstNode = _React$useContext.focusFirstNode,
      focusLastNode = _React$useContext.focusLastNode,
      focusNextNode = _React$useContext.focusNextNode,
      focusPreviousNode = _React$useContext.focusPreviousNode,
      handleFirstChars = _React$useContext.handleFirstChars,
      handleLeftArrow = _React$useContext.handleLeftArrow,
      addNodeToNodeMap = _React$useContext.addNodeToNodeMap,
      removeNodeFromNodeMap = _React$useContext.removeNodeFromNodeMap,
      contextIcons = _React$useContext.icons,
      isExpanded = _React$useContext.isExpanded,
      isFocused = _React$useContext.isFocused,
      isTabbable = _React$useContext.isTabbable,
      setFocusByFirstCharacter = _React$useContext.setFocusByFirstCharacter,
      toggle = _React$useContext.toggle;

  var nodeRef = React.useRef(null);
  var contentRef = React.useRef(null);
  var handleRef = useForkRef(nodeRef, ref);
  var icon = iconProp;
  var expandable = Boolean(Array.isArray(children) ? children.length : children);
  var expanded = isExpanded ? isExpanded(nodeId) : false;
  var focused = isFocused ? isFocused(nodeId) : false;
  var tabbable = isTabbable ? isTabbable(nodeId) : false;
  var icons = contextIcons || {};
  var theme = useTheme();

  if (!icon) {
    if (expandable) {
      if (!expanded) {
        icon = expandIcon || icons.defaultExpandIcon;
      } else {
        icon = collapseIcon || icons.defaultCollapseIcon;
      }

      if (!icon) {
        icon = icons.defaultParentIcon;
      }
    } else {
      icon = endIcon || icons.defaultEndIcon;
    }
  }

  var handleClick = function handleClick(event) {

    if (!focused) {
      focus(nodeId);
    }

    if (expandable) {
      toggle(event, nodeId);
    }

    if (onClick) {
      onClick(event);
    }
    //if the item clicked is not the top item with the cluster name
    if(!!props.organization && !!props.name){
      props.updatedimensions()
    }
  };

  // let deviceBoardCalendar = document.getElementById('')


  var clickEvent = async function clickEvent(event) {

    event.preventDefault()

    if(props.label === "Add a Host"){
      props.openaddhostdialog(props.cluster, props.index)
      return
    }

    //if the item clicked is not the top item with the cluster name, then run the functionality to fetch data for that item
    if(!!props.organization && !!props.name){

          let treeItemInfo = {
            organization: props.organization,
            name: props.name
          }

          window.history.pushState({}, '', `/device-board?org=${props.organization}&device=${props.name}`)

          props.fetchdataforselectedtreeitem(treeItemInfo)

          props.savetreeiteminfo(treeItemInfo)

    }

};


  var printableCharacter = function printableCharacter(event, key) {
    if (key === '*') {
      expandAllSiblings(event, nodeId);
      return true;
    }

    if (isPrintableCharacter(key)) {
      setFocusByFirstCharacter(nodeId, key);
      return true;
    }

    return false;
  };

  var handleNextArrow = function handleNextArrow(event) {
    if (expandable) {
      if (expanded) {
        focusNextNode(nodeId);
      } else {
        toggle(event);
      }
    }
  };

  var handlePreviousArrow = function handlePreviousArrow(event) {
    handleLeftArrow(nodeId, event);
  };

  var handleKeyDown = function handleKeyDown(event) {
    var flag = false;
    var key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.currentTarget !== event.target) {
      return;
    }

    if (event.shift) {
      if (key === ' ' || key === 'Enter') {
        event.stopPropagation();
      } else if (isPrintableCharacter(key)) {
        flag = printableCharacter(event, key);
      }
    } else {
      switch (key) {
        case 'Enter':
        case ' ':
          if (nodeRef.current === event.currentTarget && expandable) {
            toggle(event);
            flag = true;
          }

          event.stopPropagation();
          break;

        case 'ArrowDown':
          focusNextNode(nodeId);
          flag = true;
          break;

        case 'ArrowUp':
          focusPreviousNode(nodeId);
          flag = true;
          break;

        case 'ArrowRight':
          if (theme.direction === 'rtl') {
            handlePreviousArrow(event);
          } else {
            handleNextArrow(event);
            flag = true;
          }

          break;

        case 'ArrowLeft':
          if (theme.direction === 'rtl') {
            handleNextArrow(event);
            flag = true;
          } else {
            handlePreviousArrow(event);
          }

          break;

        case 'Home':
          focusFirstNode();
          flag = true;
          break;

        case 'End':
          focusLastNode();
          flag = true;
          break;

        default:
          if (isPrintableCharacter(key)) {
            flag = printableCharacter(event, key);
          }

      }
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  var handleFocus = function handleFocus(event) {
    if (!focused && tabbable) {
      focus(nodeId);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  React.useEffect(function () {
    var childIds = React.Children.map(children, function (child) {
      return child.props.nodeId;
    }) || [];

    if (addNodeToNodeMap) {
      addNodeToNodeMap(nodeId, childIds);
    }
  }, [children, nodeId, addNodeToNodeMap]);
  React.useEffect(function () {
    if (removeNodeFromNodeMap) {
      return function () {
        removeNodeFromNodeMap(nodeId);
      };
    }

    return undefined;
  }, [nodeId, removeNodeFromNodeMap]);
  React.useEffect(function () {
    if (handleFirstChars && label) {
      handleFirstChars(nodeId, contentRef.current.textContent.substring(0, 1).toLowerCase());
    }
  }, [handleFirstChars, nodeId, label]);
  React.useEffect(function () {
    if (focused) {
      nodeRef.current.focus();
    }
  }, [focused]);
  return React.createElement("li", _extends({
    className: clsx(classes.root, className, expanded && classes.expanded),
    role: "treeitem",
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    "aria-expanded": expandable ? expanded : null,
    ref: handleRef,
    tabIndex: tabbable ? 0 : -1
  }, other), React.createElement("div", {
    className: classes.content,
    ref: contentRef
  }, icon ? React.createElement("div", {
    className: classes.iconContainer,
    onClick: handleClick,
  }, icon) : null, React.createElement(Typography, {
    component: "div",
    className: (!!treeiteminfo && name === treeiteminfo.name) ? classes.selectedLabel : classes.label,
    onClick: clickEvent,
  }, label)), children && React.createElement(TransitionComponent, _extends({
    unmountOnExit: true,
    className: classes.group,
    in: expanded,
    component: "ul",
    role: "group"
  }, TransitionProps), children));
});

process.env.NODE_ENV !== "production" ? TreeItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------

  /**
   * The content of the component.
   */
  children: PropTypes.node,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * The icon used to collapse the node.
   */
  collapseIcon: PropTypes.node,

  /**
   * The icon displayed next to a end node.
   */
  endIcon: PropTypes.node,

  /**
   * The icon used to expand the node.
   */
  expandIcon: PropTypes.node,

  /**
   * The icon to display next to the tree node's label.
   */
  icon: PropTypes.node,

  /**
   * The tree node label.
   */
  label: PropTypes.node,

  /**
   * The id of the node.
   */
  nodeId: PropTypes.string.isRequired,

  /**
   * @ignore
   */
  onClick: PropTypes.func,

  /**
   * @ignore
   */
  onFocus: PropTypes.func,

  /**
   * @ignore
   */
  onKeyDown: PropTypes.func,

  /**
   * The component used for the transition.
   * [Follow this guide](/components/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   */
  TransitionComponent: PropTypes.elementType,

  /**
   * Props applied to the [`Transition`](http://reactcommunity.org/react-transition-group/transition#Transition-props) element.
   */
  TransitionProps: PropTypes.object
} : void 0;
export default withStyles(styles, {
  name: 'MuiTreeItem'
})(TreeItem);
