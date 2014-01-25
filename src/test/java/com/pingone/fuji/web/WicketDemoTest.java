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

import static org.mockito.Mockito.mock;

import org.apache.wicket.spring.injection.annot.SpringComponentInjector;
import org.apache.wicket.spring.test.ApplicationContextMock;
import org.apache.wicket.util.tester.WicketTester;
import org.junit.Before;
import org.junit.Test;

import com.pingone.fuji.web.svc.FujiSvc;

/**
 * 
 * @author dalvizu
 */
public class WicketDemoTest
{
    private ApplicationContextMock appContextMock;
    
    private SpringComponentInjector injector;
    
    private WicketTester tester;

    @Before
    public void setUp()
    {
        appContextMock = new ApplicationContextMock();
        tester = new WicketTester();
        appContextMock.putBean(mock(FujiSvc.class));
        injector = new SpringComponentInjector(tester.getApplication(), appContextMock, true);
        tester.getApplication().getComponentInstantiationListeners().add( injector );
    }
    
    @Test
    public void testSomethingSuperUserful()
    {
        tester.startPage(WicketDemo.class);
        tester.debugComponentTrees();
        tester.assertLabel("emailTaken", "false");
    }

}
