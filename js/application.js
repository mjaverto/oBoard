/*
 * Start Intial Load
 */



$(function(){

findProjects();
getAwsServices();
startRefresh();	


});


function startRefresh() {
    setTimeout(function(){
    	startRefresh();
		getServiceStatus();
		getBuildStatusUpdates();
	}, refreshRate);
    
}


/*
 * CI Build Projects Rendering
 */


function findProjects(){
	
	$.ajax({
        url: 'includes/getBuilds.php?action=getBuilds',
        dataType: "json",
        success: function(response){
			$.each(response, function( index, value ) {
		  		getProjects(index, value);
			});
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    },
	    complete: function(){   	
			getBuildStatusUpdates();
	    }
    }); 
}

function getProjects(serverType, response){
	$.each(response, function(index, serverName){
		$.each(serverName, function(serverNameIndex, server){
			renderProjects(server, serverType, serverNameIndex);
		});
	});
}


function renderProjects(response, serverType, serverNameIndex){
	
	//Check if Jenkins or Bamboo
	build = response.job ? response.job : response.project;
	
	
	//Then render each card and assign data
	$.each(build, function(buildName, buildValue){	
		buildName = buildValue.jobKey ? buildValue.jobKey : buildName;
		
		columns = $(document.createElement("div")).addClass('large-6 columns anchorWrapper');
		anchor = $(document.createElement("a")).attr('href','');
		project = $(document.createElement("div")).addClass('project fade').attr('id',buildName).attr('data-server', serverType).attr('data-servername', serverNameIndex);
		projectTitle = project.attr('id');
		projectName = $(document.createElement("div")).addClass('large-10 columns').text(buildName);
		projectStatus = $(document.createElement("div")).addClass('large-2 columns options');
			
		$.each(buildValue, function(index, value){
			project.attr('data-'+index, value);
			
		});
		
		project.append(projectName);
		project.append(projectStatus);
		columns.append(anchor);
		columns.append(project);
		$('#bambooProjects .row').append(columns);
		
	});
}

/*
 * CI Build Projects Status Updates
 */
	function getBuildStatusUpdates(){
	$('.project').each(function() {
		project = $(this).data();
		//console.log(project)
		
		
		if(project.awsapplicationname){
			getAwsBuilding(project.awsapplicationname);
		}else if(project.server === 'bamboo'){
			
		}else if(project.server === 'jenkins'){
			getJenkinsStatus(project.jobkey, project.servername);
		}
		
	});
}

function getAwsBuilding(awsProject){
	$.ajax({
        url: 'includes/aws.php?action=describeEnvironments&applicationName='+awsProject,
        dataType: "json",
        success: function(response){
			showAwsStatus(response);
			
        },
	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });
}

function showAwsStatus(response){
	app = response.Environments[0];

	var appCard = $('[data-awsapplicationname="'+app.ApplicationName+'"]');
	if(app.Health === 'Gray' || app.Health === 'Grey'){
		 if(!appCard.hasClass('updating')){			
			 var awsCard = $('[data-awsapplicationname="'+app.ApplicationName+'"] .large-2');	
			 appCard.find('.options div, .options i').remove();
			 uploading = $(document.createElement("i")).addClass('icon-cloud-upload right animated fadeInUp');
			 appCard.removeClass().addClass('project fade updating')
			 awsCard.append(uploading);
		 }
	}else if(app.Health === 'Red'){
		appCard.removeClass().addClass('project fade failed');
	}else if(app.Health === 'Yellow'){
		appCard.removeClass().addClass('project fade info');
	}else if(app.Health === 'Green'){
		appCard.find('.options div').remove();
		appCard.find('.options i.icon-cloud-upload').remove();
		appCard.removeClass('updating');
		//If AWS BeanStalk is OK, move to build status
		if(appCard.data('server') === 'jenkins'){			
			getJenkinsStatus(appCard[0].id,appCard.data('servername'))
		}else if (appCard.data('server') === 'bamboo'){
			getCurrentStatus(appCard[0].id, appCard.data('bambooprojectkey'), appCard.data('bambooshortkey'),appCard.data('servername'));
		}
	
	}
		
//Find colors here: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.healthstatus.html
}

function getCurrentStatus(projectName, bambooProjectKey, bambooShortKey, bambooServer){

    $.ajax({
        url: 'includes/bamboo.php?action=getBambooBuilds&projectName='+projectName+'&bambooProjectKey='+ bambooProjectKey +'&bambooShortKey='+ bambooShortKey+'&bambooServer='+bambooServer,
        dataType: "json",
        success: function(response){
        	if(response.isBuilding){
        		var shortKeyRow = $("[data-bambooshortkey='"+response.shortKey+"']");
				if(!shortKeyRow.hasClass('building') && !shortKeyRow.hasClass('updating')){
				
					buildingLoader = $(document.createElement("div")).addClass('right buildingIcon');
					shortKeyRow.addClass('building fade');
					$("[data-bambooshortkey='"+response.shortKey+"'] .options").append(buildingLoader);
				}	
        	}else{
				getBambooStatus(projectName, bambooProjectKey, bambooShortKey, bambooServer);
			}
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });

}

function getBambooStatus(projectName, bambooProjectKey, bambooShortKey, bambooServer){

    $.ajax({
        url: 'includes/bamboo.php?action=getBambooBuildResults&projectName='+projectName+'&bambooProjectKey='+ bambooProjectKey +'&bambooShortKey='+ bambooShortKey+'&bambooServer='+bambooServer,
        dataType: "json",
        success: function(response){
			renderBambooBuildResults(response, bambooProjectKey, bambooShortKey);			
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });

}


function renderBambooBuildResults(response, bambooProjectKey, bambooShortKey){
	if(response.results.result[0]){
		state = response.results.result[0].state;
		$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").removeClass('building updating');
		$('.row').find("[data-bambooshortkey='"+bambooShortKey +"'] .options div").remove();
		$('.row').find("[data-bambooshortkey='"+bambooShortKey +"'] .options i").remove();
		
		if(state === 'Failed'){
			if(!$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").hasClass('failed')){
			}			
			$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").removeClass().addClass('project failed fade');
		}else if(state === "Successful"){
			$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").removeClass().addClass('project success fade');
		}
	}
}

function getJenkinsStatus(jobName, serverName){
    $.ajax({
        url: 'includes/jenkins.php?action=getJenkinsStatus&jobName='+jobName+'&serverName='+serverName,
        dataType: "json",
        success: function(response){
			renderJenkinsBuildResults(response);
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });

}

function renderJenkinsBuildResults(response){
	var jenkinsJobRow = $('.row').find("#"+response.displayName);
	if(response && !jenkinsJobRow.hasClass('updating')){
		state = response.color;

		jenkinsJobRow.removeClass('building');
		$('.row').find("#"+response.displayName+" .options div").remove();
		$('.row').find("#"+response.displayName+" .options i").remove();
		
		if(state === 'red'){
			if(!jenkinsJobRow.hasClass('failed')){
			}			
			jenkinsJobRow.removeClass().addClass('project fade failed');
		}else if(state.indexOf("anime") >= 0){
			if(!jenkinsJobRow.hasClass('building')){
	
				buildingLoader = $(document.createElement("div")).addClass('right buildingIcon');
				jenkinsJobRow.removeClass().addClass('project building fade');
				jenkinsJobRow.find('.options').append(buildingLoader);
			}
		}else if(state === "yellow"){
			jenkinsJobRow.removeClass().addClass('project info fade');
		}else if(state === "blue"){
			jenkinsJobRow.removeClass().addClass('project success fade');
		}
	}
}








/******************************
 * 
 * AWS Service Feeds
 * 
 ******************************/


function getAwsServices(){
	$.ajax({
        url: 'includes/aws-status.php?action=getServices',
        dataType: "json",
        success: function(response){
			$.each(response, function( index, value ) {
			 createService(index, value);
			});
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    },
	    complete: function(){
	    	getServiceStatus();
	    	
	    }
    });
}

function createService(service, value){

	columns = $(document.createElement("div")).addClass('large-6 columns anchorWrapper');
	//anchor = $(document.createElement("a")).attr('href','');
	service = $(document.createElement("div")).addClass('service fade').attr('id',service).attr('data-aws-service',value);
	serviceTitle = service.attr('id');
	serviceName = $(document.createElement("div")).addClass('large-10 columns').text(serviceTitle);
	serviceStatus = $(document.createElement("div")).addClass('large-2 columns options');
	
	service.append(serviceName);
	service.append(serviceStatus);
	//columns.append(anchor);
	columns.append(service);
	$('#awsStatus .row').append(columns);
	
}

function getServiceStatus(){
	$('.service').each(function() {
	  serviceName = $( this ).attr('id');
	  serviceKey = $( this ).attr('data-aws-service');

	  
	  serviceName != undefined ? showServiceStatus(serviceName, serviceKey) : '';
	});
}

function showServiceStatus(serviceName, serviceKey){

    $.ajax({
        url: 'includes/aws-status.php?action=getServiceFeed&serviceKey='+serviceKey,
        dataType: "json",
        success: function(response){
			attachServiceStatus(response, serviceName, serviceKey);
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });

}
function attachServiceStatus(response, serviceName, serviceKey){
	if(response.item[0]){
		state = response.item[0].title;
		description = response.item[1].description;
		
		serviceRow = $('#awsStatus .row').find("[data-aws-service='"+serviceKey +"']");
		$('#awsStatus .row').find("[data-aws-service='"+serviceKey +"'] .large-10").text(response.title);
		serviceRow.attr('title',state);
		
		if (state.indexOf("[RESOLVED]") >= 0 || description.indexOf("resolved") >= 0){
			serviceRow.removeClass().addClass('service fade up');
		}else if(state.indexOf("Informational message:") >= 0){
			serviceRow.removeClass().addClass('service fade info');
		}else{
			serviceRow.removeClass().addClass('service fade down');
		}
	}else{
		serviceRow.removeClass('up, down, info');
	}
}