import org.openqa.selenium.Capabilities;
import org.openqa.selenium.Platform;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.SeleneseCommandExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import org.openqa.selenium.iphone.IPhoneDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.Command;
import org.openqa.selenium.remote.DesiredCapabilities;

import com.thoughtworks.selenium.Selenium;

class iOSWrapper extends BrowserWrapper {
	protected String deviceURL;
	public iOSWrapper (){
		super();
	}

	public void setDeviceURL(String deviceURL){ 
		this.deviceURL=deviceURL;
	}

  public Selenium openBrowser(String url){
			try { 
				driver = new IPhoneDriver(deviceURL);
				selenium = new WebDriverBackedSelenium(driver,url);
			} catch(Exception e){
				System.err.println(e.toString());
				e.printStackTrace();
			}
    	return selenium;
	}
}

