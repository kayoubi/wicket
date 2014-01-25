/***************************************************************************
 * Copyright (C) 2013 Ping Identity Corporation
 * All rights reserved.
 * 
 * The contents of this file are the property of Ping Identity Corporation.
 * You may not copy or use this file, in either source code or executable
 * form, except in compliance with terms set by Ping Identity Corporation.
 * For further information please contact:
 * 
 *     Ping Identity Corporation
 *     1001 17th Street Suite 100
 *     Denver, CO 80202
 *     303.468.2900
 *     http://www.pingidentity.com
 * 
 **************************************************************************/

package com.pingone.fuji.web;

import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.link.BookmarkablePageLink;

/**
 * 
 * @author dalvizu
 */
public class HomePage
    extends WebPage
{
    private static final long serialVersionUID = -5936903709843445791L;

    public HomePage()
    {
        super();
        add(new BookmarkablePageLink<WicketDemo>("wicketDemo", WicketDemo.class));
    }
    
}